from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
import google.generativeai as genai
from PyPDF2 import PdfReader
import os
from dotenv import load_dotenv
import logging
import io
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import tempfile
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from database.mongodb_client import MongoDB
from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    profile_picture: str

# Set up logging
logging.basicConfig(
    level=logging.INFO,  # Changed from DEBUG to INFO
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize MongoDB connection
try:
    mongo_uri = os.getenv('MONGO_URI')
    if not mongo_uri:
        raise ValueError("MONGO_URI not found in environment variables")
    
    client = MongoClient(mongo_uri)
    db = client['healthport']
    collection = db['analyses']
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

router = APIRouter()


@router.post("/google-login")
async def google_login(user_data: User):
    """Handle Google Login and store user data"""
    try:
        # Save or update user in MongoDB
        existing_user = await MongoDB.save_user(user_data.dict())

        if existing_user:
            return {"message": "User already exists", "user": existing_user}
        else:
            return {"message": "User registered successfully", "user": user_data.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during user login: {str(e)}")

# Configure Gemini
try:
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    logger.info("Configuring Gemini with API key...")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    logger.info("Gemini configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Gemini: {str(e)}")
    raise HTTPException(status_code=500, detail=f"Failed to initialize AI model: {str(e)}")

def extract_text_from_pdf(pdf_bytes):
    """Extract text from PDF using both PyPDF2 and OCR if needed."""
    text = ""
    
    # First try PyPDF2
    try:
        pdf_stream = io.BytesIO(pdf_bytes)
        pdf_reader = PdfReader(pdf_stream)
        
        if pdf_reader.is_encrypted:
            raise HTTPException(status_code=400, detail="Encrypted PDFs are not supported")
        
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        logger.warning(f"PyPDF2 extraction failed: {str(e)}")
    
    # If no text was extracted, try OCR
    if not text.strip():
        try:
            # Convert PDF to images
            images = convert_from_bytes(pdf_bytes)
            logger.info(f"Converted PDF to {len(images)} images for OCR")
            
            # Process each page with OCR
            for i, image in enumerate(images):
                # Save image temporarily
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                    image.save(temp_file.name)
                    # Extract text using OCR
                    page_text = pytesseract.image_to_string(Image.open(temp_file.name))
                    if page_text:
                        text += page_text + "\n"
                    else:
                        logger.warning(f"No text found on page {i+1} using OCR")
                # Clean up temporary file
                os.unlink(temp_file.name)
        except Exception as e:
            logger.error(f"OCR processing failed: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to process PDF with OCR: {str(e)}")
    
    return text

def parse_analysis(text):
    """Parse the raw analysis text into a structured format."""
    try:
        logger.info("Starting to parse analysis text")
        logger.debug(f"Raw text to parse: {text[:500]}...")  # Log first 500 chars for debugging

        # Initialize the analysis structure
        analysis = {
            "summary": {
                "patient_overview": "",
                "key_findings": "",
                "overall_assessment": "",
                "urgency_level": ""
            },
            "keyFindings": [],
            "recommendations": [],
            "followUpActions": [],
            "additionalNotes": ""
        }

        # Split the text into sections, handling different types of line breaks
        sections = [s.strip() for s in text.split('\n\n') if s.strip()]
        logger.info(f"Found {len(sections)} sections in the text")
        
        current_section = None
        section_content = []
        
        for section in sections:
            section = section.strip()
            if not section:
                continue

            # Check for section headers (more flexible matching)
            section_upper = section.upper()
            
            if 'PATIENT' in section_upper and 'OVERVIEW' in section_upper:
                if current_section and section_content:
                    # Save previous section content
                    content = '\n'.join(section_content)
                    if current_section == 'key_findings':
                        analysis["keyFindings"] = [p.strip() for p in content.split('\n') if p.strip()]
                    elif current_section in analysis["summary"]:
                        analysis["summary"][current_section] = content
                current_section = 'patient_overview'
                section_content = [section.replace('PATIENT OVERVIEW', '').strip()]
            elif 'KEY' in section_upper and 'FINDINGS' in section_upper:
                if current_section and section_content:
                    content = '\n'.join(section_content)
                    if current_section in analysis["summary"]:
                        analysis["summary"][current_section] = content
                current_section = 'key_findings'
                section_content = [section.replace('KEY FINDINGS', '').strip()]
            elif 'OVERALL' in section_upper and 'ASSESSMENT' in section_upper:
                if current_section and section_content:
                    content = '\n'.join(section_content)
                    if current_section in analysis["summary"]:
                        analysis["summary"][current_section] = content
                current_section = 'overall_assessment'
                section_content = [section.replace('OVERALL ASSESSMENT', '').strip()]
            elif 'URGENCY' in section_upper and 'LEVEL' in section_upper:
                if current_section and section_content:
                    content = '\n'.join(section_content)
                    if current_section in analysis["summary"]:
                        analysis["summary"][current_section] = content
                current_section = 'urgency_level'
                section_content = [section.replace('URGENCY LEVEL', '').strip()]
            else:
                # If we're in a section, add the content
                if current_section:
                    section_content.append(section)

        # Save the last section's content
        if current_section and section_content:
            content = '\n'.join(section_content)
            if current_section == 'key_findings':
                # Split by bullet points or newlines
                points = [p.strip() for p in content.split('\n') if p.strip()]
                for point in points:
                    if point.startswith('-') or point.startswith('*'):
                        point = point[1:].strip()
                    analysis["keyFindings"].append(point)
            elif current_section in analysis["summary"]:
                analysis["summary"][current_section] = content

        # Validate the analysis
        missing_sections = []
        if not analysis["summary"]["patient_overview"]:
            missing_sections.append("patient_overview")
        if not analysis["summary"]["key_findings"] and not analysis["keyFindings"]:
            missing_sections.append("key_findings")
        if not analysis["summary"]["overall_assessment"]:
            missing_sections.append("overall_assessment")

        if missing_sections:
            logger.warning(f"Missing required sections: {missing_sections}")
            # Try to extract information from the raw text as a fallback
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            
            if paragraphs:
                if "patient_overview" in missing_sections:
                    analysis["summary"]["patient_overview"] = paragraphs[0]
                
                if "key_findings" in missing_sections and len(paragraphs) > 1:
                    analysis["summary"]["key_findings"] = paragraphs[1]
                    analysis["keyFindings"] = [p.strip() for p in paragraphs[1].split('\n') if p.strip()]
                
                if "overall_assessment" in missing_sections and len(paragraphs) > 2:
                    analysis["summary"]["overall_assessment"] = paragraphs[-1]

        # Final validation
        if not any([analysis["summary"]["patient_overview"], 
                   analysis["summary"]["key_findings"], 
                   analysis["summary"]["overall_assessment"]]):
            logger.error("Failed to extract any required sections from the analysis")
            raise ValueError("Analysis missing required sections")

        logger.info("Successfully parsed analysis")
        return analysis

    except Exception as e:
        logger.error(f"Error parsing analysis: {str(e)}")
        raise ValueError(f"Failed to parse analysis: {str(e)}")

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file upload request: {file.filename}")
        
        # Validate file type
        if not file.filename.endswith('.pdf'):
            logger.error(f"Invalid file type: {file.filename}")
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported"
            )

        # Read file content
        contents = await file.read()
        if not contents:
            logger.error("Empty file received")
            raise HTTPException(
                status_code=400,
                detail="File is empty"
            )

        logger.info(f"File size: {len(contents)} bytes")

        # Extract text from PDF
        try:
            logger.info("Attempting to extract text from PDF")
            text = extract_text_from_pdf(contents)
            if not text.strip():
                logger.error("No text could be extracted from PDF")
                raise HTTPException(
                    status_code=400,
                    detail="No text could be extracted from the PDF. The file might be scanned or protected."
                )
            logger.info(f"Successfully extracted {len(text)} characters from PDF")
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to extract text from PDF: {str(e)}"
            )

        # Generate analysis using Gemini
        try:
            logger.info("Generating analysis using Gemini")
            prompt = f"""Analyze this medical lab report and provide a detailed analysis. Your response MUST follow this exact format with these exact section headers:

PATIENT OVERVIEW
[Provide a brief overview of the patient's demographics and the type of test performed]

KEY FINDINGS
[List the key findings from the lab report, focusing on abnormal values and their significance. Use bullet points (-) for each finding]

OVERALL ASSESSMENT
[Provide a comprehensive assessment of the patient's condition based on the lab results]

URGENCY LEVEL
[Indicate the urgency level: low, moderate, high, or critical]

NORMAL RANGES
[Include the normal reference ranges for the tests performed]

INTERPRETATION
[Provide a detailed interpretation of the results, including potential causes and implications]

IMPORTANT:
1. Use EXACTLY these section headers in ALL CAPS
2. Each section must be separated by a blank line
3. Do not add any additional sections
4. Do not modify the section headers
5. Each section must contain content

Here's the lab report text:
{text}"""

            response = model.generate_content(prompt)
            if not response or not response.text:
                logger.error("No response received from Gemini")
                raise HTTPException(
                    status_code=500,
                    detail="Failed to get analysis from AI model"
                )
            
            logger.info("Successfully received response from Gemini")
            analysis_text = response.text
            logger.debug(f"Gemini response: {analysis_text[:500]}...")  # Log first 500 chars

            # Parse the analysis into structured format
            try:
                logger.info("Parsing analysis into structured format")
                analysis = parse_analysis(analysis_text)
                logger.info("Successfully parsed analysis")
            except Exception as e:
                logger.error(f"Error parsing analysis: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to parse analysis: {str(e)}"
                )

            # Store in MongoDB
            try:
                logger.info("Storing analysis in MongoDB")
                result = collection.insert_one({
                    "timestamp": datetime.utcnow(),
                    "filename": file.filename,
                    "analysis": analysis
                })
                logger.info(f"Successfully stored analysis with ID: {result.inserted_id}")
            except Exception as e:
                logger.error(f"Error storing analysis in MongoDB: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to store analysis: {str(e)}"
                )
            
            analysis_data = {
            "user_email": user.email,
            "timestamp": datetime.utcnow(),
            "filename": file.filename,
            "analysis": analysis
            }

            await MongoDB.save_analysis(analysis_data)

            return {"message": "File uploaded and analysis saved successfully", "analysis": analysis}

        except Exception as e:
            logger.error(f"Error generating analysis: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to analyze the document: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@router.get("/latest")
async def get_latest_analysis():
    try:
        # Get the latest analysis from MongoDB
        latest_analysis = collection.find_one(
            sort=[("timestamp", -1)]  # Sort by timestamp in descending order
        )
        
        if not latest_analysis:
            return JSONResponse(
                status_code=404,
                content={"message": "No analysis results found"}
            )
        
        # Convert ObjectId to string for JSON serialization
        latest_analysis["_id"] = str(latest_analysis["_id"])
        
        return latest_analysis
    except Exception as e:
        logger.error(f"Error fetching latest analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch latest analysis: {str(e)}"
        )

# You'll add more routes here later
@router.get("/history/{user_email}")
async def get_user_history(user_email: str):
    """Fetch a user's lab report history"""
    try:
        user_reports = await MongoDB.get_data("analyses", {"user_email": user_email})
        if not user_reports:
            raise HTTPException(status_code=404, detail="No reports found")
        
        return {"reports": user_reports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")
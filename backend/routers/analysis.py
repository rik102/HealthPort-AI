from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
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

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

router = APIRouter()

# Configure Gemini
try:
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    
    logger.info("Configuring Gemini with API key...")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-pro-exp-03-25')
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

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file upload request for file: {file.filename}")
        
        if not file.filename.endswith('.pdf'):
            logger.error(f"Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="File must be a PDF")
            
        # Read the PDF file
        contents = await file.read()
        logger.info(f"File size: {len(contents)} bytes")
        
        if not contents:
            logger.error("Empty file received")
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Extract text from PDF
        try:
            text = extract_text_from_pdf(contents)
            logger.info(f"Extracted {len(text)} characters from PDF")
            
            if not text.strip():
                logger.error("No text could be extracted from PDF")
                raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
                
        except Exception as e:
            logger.error(f"PDF processing error: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to process PDF file: {str(e)}")
        
        # Create a prompt for Gemini
        prompt = f"""
        Analyze this medical lab report and provide:
        1. A summary of the key findings
        2. Any values that are outside normal ranges
        3. Potential health implications
        4. Recommendations for follow-up if needed
        
        Here's the lab report text:
        {text}
        """
        
        # Get response from Gemini
        try:
            logger.info("Sending request to Gemini API")
            response = model.generate_content(prompt)
            if not response.text:
                logger.error("Empty response from Gemini API")
                raise HTTPException(status_code=500, detail="No response from AI model")
            logger.info("Received response from Gemini API")
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to get analysis from AI model: {str(e)}")
        
        return JSONResponse(content={
            "status": "success",
            "analysis": response.text
        })
        
    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he.detail)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# You'll add more routes here later
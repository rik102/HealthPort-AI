# HealthPort AI

HealthPort AI is an intelligent medical report analysis tool that uses AI to analyze lab reports and provide detailed insights. The application features a modern, responsive interface with real-time analysis capabilities.

## Features

- PDF and image upload support
- AI-powered analysis of medical reports
- Real-time progress tracking
- Modern, responsive UI
- Detailed analysis results
- Support for both text-based and scanned PDFs

## Prerequisites

Before you begin, ensure you have the following installed:

### For Windows:

1. **Python 3.8+**
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation

2. **Tesseract OCR**
   - Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - During installation, make sure to:
     - Check "Add to PATH"
     - Note the installation path (default: `C:\Program Files\Tesseract-OCR`)

3. **Poppler**
   - Download from [poppler releases](https://github.com/oschwartz10612/poppler-windows/releases/)
   - Extract to a folder (e.g., `C:\Program Files\poppler`)
   - Add the bin directory to your PATH:
     - Open System Properties > Advanced > Environment Variables
     - Add `C:\Program Files\poppler\Library\bin` to Path

### For macOS:

1. **Python 3.8+**
   - Install using Homebrew: `brew install python`

2. **Tesseract OCR**
   - Install using Homebrew: `brew install tesseract`

3. **Poppler**
   - Install using Homebrew: `brew install poppler`

### For Linux:

1. **Python 3.8+**
   - Install using your package manager:
     - Ubuntu/Debian: `sudo apt install python3`
     - Fedora: `sudo dnf install python3`

2. **Tesseract OCR**
   - Ubuntu/Debian: `sudo apt install tesseract-ocr`
   - Fedora: `sudo dnf install tesseract`

3. **Poppler**
   - Ubuntu/Debian: `sudo apt install poppler-utils`
   - Fedora: `sudo dnf install poppler-utils`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HealthPort-AI.git
cd HealthPort-AI
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

4. Create environment files:

Backend (create `backend/.env`):
```
GOOGLE_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_uri
```

Frontend (create `frontend/.env`):
```
VITE_API_URL=http://localhost:8000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Click the upload area or drag and drop a PDF file
2. Wait for the analysis to complete
3. View the detailed analysis results
4. Download or share the results as needed

## Troubleshooting

### Common Issues

1. **Tesseract not found**
   - Ensure Tesseract is installed and in your PATH
   - Verify installation: `tesseract --version`

2. **Poppler not found**
   - Ensure Poppler is installed and in your PATH
   - Verify installation: `pdftoppm --version`

3. **Python package installation issues**
   - Try upgrading pip: `python -m pip install --upgrade pip`
   - Ensure you're using the correct Python version

4. **CORS errors**
   - Ensure both frontend and backend servers are running
   - Check the API URL in frontend/.env

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI analysis
- MongoDB for data storage
- FastAPI for backend framework
- React for frontend framework
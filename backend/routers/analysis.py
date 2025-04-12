from fastapi import APIRouter

router = APIRouter()

@router.post("/upload")
async def upload_pdf():
    return {"message": "PDF uploaded (not really processed yet)"}

# You'll add more routes here later
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis
from database.mongodb_client import MongoDB
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await MongoDB.connect_db()
    yield
    # Shutdown
    await MongoDB.close_db()

app = FastAPI(lifespan=lifespan)

# Allow requests from both Vite dev server and potential production frontend
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server (if needed)
    "http://127.0.0.1:5173",  # Alternative localhost
    "http://127.0.0.1:3000",   # Alternative localhost
    "https://www.aihealthport.tech",
    "https://aihealthport.tech"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/analysis", tags=["analysis"])

@app.get("/")
async def root():
    return {"message": "Backend is running"}
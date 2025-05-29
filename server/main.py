from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.asset import router as asset_router

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(asset_router)
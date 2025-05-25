from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes import bronze
from server.db import get_connection
import os
from pathlib import Path
import duckdb

# FastAPI 앱 생성
app = FastAPI()

@app.on_event("startup")
async def startup_event():
    """서버 시작 시 DuckDB 연결 테스트"""
    print("\n🔄 DuckDB 연결 테스트 시작")
    
    try:
        conn = get_connection()
        # 간단한 연결 테스트
        conn.execute("SELECT 1")
        print("✅ DuckDB 연결 성공")
        conn.close()
    except Exception as e:
        print(f"❌ DuckDB 연결 실패: {str(e)}")
        raise e
    
# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bronze.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "FastAPI with DuckDB is running"}
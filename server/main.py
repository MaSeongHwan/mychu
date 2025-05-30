from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
from .routes.recommendations import router as recommendations_router
from .routes.asset import router as asset_router
from .core.database import init_db, engine
from .core.database import engine, init_db
import pandas as pd
from sqlalchemy import text

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:8000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 마운트
app.mount("/static", StaticFiles(directory="client/src/styles"), name="static")
app.mount("/assets", StaticFiles(directory="client/src/assets"), name="assets")
app.mount("/firebase", StaticFiles(directory="client/src/firebase"), name="firebase")
app.mount("/pages", StaticFiles(directory="client/public"), name="pages")

# 템플릿 설정
templates = Jinja2Templates(directory="client/public")

# 메인 페이지 라우트
# @app.get("/")
# async def read_root(request: Request):
#     return templates.TemplateResponse("login.html", {"request": request})

@app.get("/")
async def read_main(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

# 랜덤 추천 라우트 - 동기 방식으로 변경
@app.get("/recommendations/random")
def get_random_recommendations(count: int = 10, type: str = None):
    try:
        where_clause = ""
        if type == "movie":
            where_clause = "WHERE a.genre IN ('영화', '액션/모험', '액션/어드벤쳐')"
        elif type == "drama":
            where_clause = "WHERE a.genre IN ('드라마', '미니시리즈', '주말연속극')"
        
        query = text(f"""
            SELECT a.full_asset_id, a.asset_nm, a.genre, a.actr_disp, 
                   COALESCE(i.poster_path, '') as poster_path
            FROM asset a
            LEFT JOIN imagedb i ON a.full_asset_id = i.full_asset_id
            {where_clause}
            ORDER BY RANDOM()
            LIMIT :count
        """)
        
        # 동기식 DB 연결 사용
        with engine.connect() as conn:
            result = conn.execute(query, {"count": count})
            # 결과를 직접 딕셔너리로 변환
            records = [{
                'full_asset_id': row.full_asset_id,
                'asset_nm': row.asset_nm,
                'genre': row.genre,
                'actr_disp': row.actr_disp,
                'poster_path': row.poster_path
            } for row in result]
            return {"items": records}
            
    except Exception as e:
        print(f"Error: {e}")
        raise

# 라우터 등록
app.include_router(asset_router)
app.include_router(recommendations_router)

@app.on_event("startup")
async def startup_event():
    try:
        if not init_db():
            raise Exception("Database connection test failed")
        print("Database initialized successfully")
    except Exception as e:
        print(f"Startup error: {e}")
        raise
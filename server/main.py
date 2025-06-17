from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse,HTMLResponse
import os
import logging
import sys

# 라우터 import
from server.api.routes.asset import router as asset_router  
from server.api.routes.log import router as log_router
from server.api.routes.search import router as search_router
from server.api.routes.user import router as user_router
from server.api.routes.recommendation_test import router as rec_test_router
from server.api.routes.recommendations import router as rec_router

# 설정 및 초기화
from server.config.settings import CORS_ORIGINS
from server.core.database import init_db
from server.core.firebase import init_firebase


# 앱 생성
app = FastAPI()

# Firebase 초기화
router = APIRouter()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# 경로 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_PUBLIC_DIR = os.path.join(BASE_DIR, "client", "public")
CLIENT_SRC_DIR = os.path.join(BASE_DIR, "client", "src")
CLIENT_DIR = os.path.join(BASE_DIR, "client")

# 경로 디버깅 로그
logger = logging.getLogger("uvicorn")
logger.info(f"BASE_DIR: {BASE_DIR}")
logger.info(f"CLIENT_PUBLIC_DIR: {CLIENT_PUBLIC_DIR}")
logger.info(f"CLIENT_SRC_DIR: {CLIENT_SRC_DIR}")

# 템플릿 설정
templates = Jinja2Templates(directory=CLIENT_PUBLIC_DIR)

# 정적 파일 서빙 - 절대 경로 사용
app.mount("/static", StaticFiles(directory=CLIENT_PUBLIC_DIR), name="static")
app.mount("/src", StaticFiles(directory=CLIENT_SRC_DIR), name="src")
app.mount("/client", StaticFiles(directory=CLIENT_DIR), name="client")
app.mount("/components", StaticFiles(directory="client/public/components"), name="components")

# 정적 파일 존재 여부 확인 및 로깅
css_path = os.path.join(CLIENT_SRC_DIR, "styles", "mylist.css")
if os.path.exists(css_path):
    logger.info(f"CSS file found at: {css_path}")
else:
    logger.error(f"CSS file NOT found at: {css_path}")

# 라우터 등록
app.include_router(user_router,       prefix="/users", tags=["users"])
app.include_router(asset_router,      prefix="/assets", tags=["assets"])
app.include_router(log_router,        prefix="/logs",   tags=["logs"])
app.include_router(search_router,     prefix="/search", tags=["search"])
app.include_router(rec_test_router,   prefix="",        tags=["recommendation"])
app.include_router(rec_router,        prefix="",        tags=["recommendations"])

# 로거 설정
logger = logging.getLogger("uvicorn")

# 서버 시작 시 초기화 및 디버깅 로그 출력
@app.on_event("startup")
async def startup_event():
    logger.info(f"Python version: {sys.version}")
    logger.info(f"Working directory: {os.getcwd()}")
    logger.info(f"Template directory: {CLIENT_PUBLIC_DIR}")
    logger.info(f"Templates available: {os.listdir(CLIENT_PUBLIC_DIR)}")
    init_db()
    init_firebase()


# 페이지 라우트
@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/index")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/main")
async def read_main(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

@app.get("/mylist")
async def read_mylist(request: Request):
    return templates.TemplateResponse("mylist.html", {"request": request})

@app.get("/adult")
async def read_adult(request: Request):
    return templates.TemplateResponse("adult.html", {"request": request})

@app.get("/contents", response_class=HTMLResponse)
async def read_contents(request: Request):
    return templates.TemplateResponse("contents.html", {"request": request})

@app.get("/contents_test")
async def read_contents_test(request: Request):
    return templates.TemplateResponse("contents_test.html", {"request": request})


# 템플릿 및 정적 파일 디버깅용 라우터
@app.get("/debug-templates")
async def debug_templates():
    try:
        templates_list = os.listdir(CLIENT_PUBLIC_DIR)
        return {
            "working_directory": os.getcwd(),
            "template_directory": CLIENT_PUBLIC_DIR,
            "available_templates": templates_list,
            "template_exists": "mylist.html" in templates_list,
            "absolute_path": os.path.join(CLIENT_PUBLIC_DIR, "mylist.html")
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/debug-static")
async def debug_static():
    try:
        css_path = os.path.join(CLIENT_SRC_DIR, "styles", "mylist.css")
        js_path = os.path.join(CLIENT_SRC_DIR, "pages", "mylist.js")
        config_path = os.path.join(CLIENT_SRC_DIR, "firebase", "config.js")
        
        return {
            "base_dir": BASE_DIR,
            "client_src_dir": CLIENT_SRC_DIR,
            "css_exists": os.path.exists(css_path),
            "css_path": css_path,
            "js_exists": os.path.exists(js_path),
            "js_path": js_path,
            "config_exists": os.path.exists(config_path),
            "config_path": config_path,
            "static_mounts": [
                {"route": "/static", "directory": CLIENT_PUBLIC_DIR},
                {"route": "/src", "directory": CLIENT_SRC_DIR},
                {"route": "/client", "directory": CLIENT_DIR}
            ]
        }
    except Exception as e:
        return {"error": str(e)}
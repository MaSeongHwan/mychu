from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from server.api.routes.asset import router as asset_router  
from server.api.routes.log import router as log_router
from server.api.routes.search import router as search_router
from server.api.routes.user import router as user_router
from server.api.routes.recommendation_test import router as rec_test_router
from server.api.routes.recommendation_test_endpoint import test_router as rec_test_endpoint_router
from server.routes.recommendations import router as legacy_rec_router  # Add the old recommendations router
from server.config.settings import CORS_ORIGINS
from server.core.database import init_db
from server.core.database import init_db
from server.core.firebase_auth import init_firebase
app = FastAPI()

# Firebase 초기화
init_firebase()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # 프리플라이트 요청 캐시 시간 (초)
)

# Initialize templates
templates = Jinja2Templates(directory="client/public")

# Static file mounting
app.mount("/static", StaticFiles(directory="client/public"), name="static")
app.mount("/src", StaticFiles(directory="client/src"), name="src")
app.mount("/client", StaticFiles(directory="client"), name="client")

# Initialize routes
app.include_router(user_router,       prefix="/users",         tags=["users"])
app.include_router(asset_router,      prefix="/assets",        tags=["assets"])
app.include_router(log_router,        prefix="/logs",          tags=["logs"])
app.include_router(search_router,     prefix="/search",        tags=["search"])
app.include_router(rec_test_router,   prefix="",               tags=["recommendation"])
app.include_router(rec_test_endpoint_router, prefix="",       tags=["recommendation-test"])
app.include_router(legacy_rec_router, prefix="",               tags=["recommendations"])


@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login")
async def read_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/main")
async def read_main(request: Request):
    return templates.TemplateResponse("main.html", {"request": request})

@app.get("/mylist.html")
async def read_mylist(request: Request):
    return templates.TemplateResponse("mylist.html", {"request": request})

# 이전 경로도 유지하여 하위 호환성을 제공합니다
@app.get("/mylist")
async def read_mylist_compat(request: Request):
    return templates.TemplateResponse("mylist.html", {"request": request})
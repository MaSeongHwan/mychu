from fastapi import APIRouter, Depends, HTTPException
from server.core.database import get_db
from sqlalchemy.orm import Session
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 더미 데이터 설정
DUMMY_MOVIES = [
    {
        "idx": i,
        "asset_nm": f"영화 제목 {i}",
        "poster_path": f"https://picsum.photos/300/450?random={i}",
        "genre": "액션/드라마"
    } for i in range(1, 11)
]

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

# 레거시 추천 라우트는 server/api/routes/recommendation_test.py로 이전되었습니다.
# /recommendations/top, /recommendations/emotion, /recommendations/recent 엔드포인트는
# /recommendation/top, /recommendation/emotion, /recommendation/recent로 대체되었습니다.
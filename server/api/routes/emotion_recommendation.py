from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import numpy as np

from server.core.database import get_db
from server.models.user import User
from server.api.schemas.recommendation import RecommendationResponse, RecommendationItem
from server.core.services.emotion_utils import get_user_emotion_vector, recommend_by_emotion
from server.core.services.emotion_message_map import emotion_message_map

router = APIRouter(
    prefix="/emotion",
    tags=["emotion_recommendation"]
)

# 감정 메시지 매핑
def get_emotion_message(emotion: str) -> str:
    return emotion_message_map.get(emotion, "오늘의 추천 콘텐츠입니다.")

@router.get("/recommendation", response_model=RecommendationResponse)
def get_emotion_based_recommendation(
    user_id: int = Query(..., description="유저 ID"),
    top_k: int = Query(10, description="추천 콘텐츠 개수"),
    db: Session = Depends(get_db)
):
    """
    감정 분석 + 콘텐츠 추천 통합 API
    """
    # 유저 확인
    user = db.query(User).filter(User.user_idx == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 감정 벡터 추정
    user_vector = get_user_emotion_vector(db, user_id)
    if user_vector is None:
        raise HTTPException(status_code=404, detail="감정 추정 불가 (시청 로그 부족)")

    # # 추천 및 지배 감정
    # recommended_assets, dominant_emotion = recommend_by_emotion(db, user_vector, top_k)
    # emotion_message = get_emotion_message(dominant_emotion)
    # nickname = user.nick_name or "고객"
    # 추천
# 추천
    recommended_assets, _ = recommend_by_emotion(db, user_vector, top_k)

    # 최근 로그 기반 감정 메시지
    from server.core.services.emotion_utils import get_dominant_emotion_from_recent_logs
    dominant_emotion = get_dominant_emotion_from_recent_logs(db, user_id)
    if dominant_emotion:
        emotion_message = get_emotion_message(dominant_emotion)
    else:
        emotion_message = "오늘의 추천 콘텐츠입니다."
    nickname = user.nick_name or "고객"  # ✅ 이 줄 다시 추가!



    # 응답 포맷팅
    items = [
        RecommendationItem(
            idx=a.idx,
            full_asset_id=a.full_asset_id,
            unique_asset_id=a.unique_asset_id,
            asset_nm=a.asset_nm,
            super_asset_nm=a.super_asset_nm,
            actr_disp=a.actr_disp,
            genre=a.genre,
            degree=a.degree,
            asset_time=a.asset_time,
            rlse_year=a.rlse_year,
            smry=a.smry,
            epsd_no=a.epsd_no,
            is_adult=a.is_adult,
            is_movie=a.is_movie,
            is_drama=a.is_drama,
            is_main=a.is_main,
            keyword=a.keyword,
            poster_path=a.poster_path,
            smry_shrt=getattr(a, 'smry_shrt', None)
        ) for a in recommended_assets
    ]

    return RecommendationResponse(
        message=f"{nickname}님, {emotion_message}",
        items=items
    )

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from server.core.database import get_db
from server.models.user import User, VodLog
from server.models.asset import Asset, AssetEmotion
from server.api.schemas.recommendation import RecommendationResponse, RecommendationItem
from server.core.services.emotion_utils import get_user_emotion_vector, recommend_by_emotion
from server.core.services.emotion_message_map import emotion_message_map

router = APIRouter(
    prefix="/recommendation",
    tags=["emotion_recommendation"]
)

# 감정 메시지 매핑 함수 0625
def get_emotion_message(emotion: str) -> str:
    return emotion_message_map.get(emotion, "오늘의 추천 콘텐츠입니다.")

@router.get("/emotion", response_model=RecommendationResponse)
def get_emotion_based_recommendation(
    user_id: int = Query(..., description="유저 ID"),
    db: Session = Depends(get_db)
):
    # 1. 유저 존재 여부 확인
    user = db.query(User).filter(User.user_idx == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. 유저의 최근 시청 로그 기반 감정 벡터 계산
    user_vector = get_user_emotion_vector(db, user_id)
    if user_vector is None:
        raise HTTPException(status_code=404, detail="감정 추정 불가 (시청 로그 부족)")

    # 3. 감정 벡터 기반으로 추천
    recommended_assets, dominant_emotion = recommend_by_emotion(db, user_vector)

    # 4. 감정에 맞는 메시지 불러오기
    emotion_message = get_emotion_message(dominant_emotion)
    nickname = user.nick_name or "고객"

    # 5. 추천 콘텐츠 포맷팅
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

    # 6. 최종 응답
    return RecommendationResponse(
        message=f"{nickname}님, {emotion_message}",
        items=items
    )

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Optional

from server.core.database import get_db
from server.models.asset import Asset
from server.recommender.model_inference import RecommenderModel
from server.recommender.slate_generator import SlateGenerator

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"]
)

recommender_model = RecommenderModel()
slate_generator = SlateGenerator()

@router.get("/")
async def get_recommendations(
    user_id: Optional[int] = None,
    count: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """사용자 맞춤 추천 목록 반환"""
    # 1. 추천 후보 콘텐츠 가져오기
    candidate_items = recommender_model.get_user_recommendations(user_id or 1, top_n=count*2)
    
    # 2. 슬레이트 생성하여 최종 추천 목록 생성
    recommendations = slate_generator.generate_slate(user_id or 1, candidate_items, count=count)
    
    # 3. 추천된 콘텐츠 정보 가져오기
    if recommendations:
        item_ids = [item['id'] for item in recommendations]
        items = db.query(Asset).filter(Asset.id.in_(item_ids)).all()
        items_dict = {item.id: item.to_dict() for item in items}
        
        # 결과 포맷팅
        for rec in recommendations:
            if rec['id'] in items_dict:
                rec.update(items_dict[rec['id']])
    
    return {"recommendations": recommendations}

@router.get("/similar/{item_id}")
async def get_similar_items(
    item_id: int,
    count: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """특정 콘텐츠와 유사한 추천 목록 반환"""
    similar_items = recommender_model.get_item_recommendations(item_id, top_n=count)
    
    if similar_items:
        item_ids = [item['id'] for item in similar_items]
        items = db.query(Asset).filter(Asset.id.in_(item_ids)).all()
        items_dict = {item.id: item.to_dict() for item in items}
        
        # 결과 포맷팅
        for rec in similar_items:
            if rec['id'] in items_dict:
                rec.update(items_dict[rec['id']])
    
    return {"similar_items": similar_items}

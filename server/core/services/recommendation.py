from typing import List, Dict
import pandas as pd
from sqlalchemy import text
from ..database import engine
import logging

logger = logging.getLogger(__name__)

async def get_random_recommendations(n: int = 10, category: str = None) -> List[Dict]:
    """비동기 랜덤 추천"""
    try:
        # 카테고리 필터
        where_clause = ""
        if category == "movie":
            where_clause = "WHERE a.genre IN ('영화', '액션/모험', '액션/어드벤쳐')"
        elif category == "drama":
            where_clause = "WHERE a.genre IN ('드라마', '미니시리즈', '주말연속극')"
        
        # 필요한 컬럼만 선택하고 LIMIT을 적용하여 효율적으로 데이터 로드
        query = f"""
            SELECT 
                a.full_asset_id, 
                a.asset_nm,
                COALESCE(i.poster_path, '') as poster_path
            FROM asset a
            LEFT JOIN imagedb i ON a.full_asset_id = i.full_asset_id
            {where_clause}
            ORDER BY RANDOM() 
            LIMIT {n}
        """
        
        # pandas를 사용하여 효율적으로 데이터 로드
        df = pd.read_sql_query(query, engine)
        
        # 결과를 딕셔너리 리스트로 변환
        result = df.to_dict('records')
        
        logger.info(f"{category if category else '전체'} 카테고리 {n}개 추천 완료")
        return result
            
    except Exception as e:
        logger.error(f"랜덤 추천 생성 중 오류 발생: {e}")
        raise 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_session
from sqlalchemy import text

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("/")
def get_recommendations(
    n: int = 10,
    category: str = None,
    db: Session = Depends(get_session)
):
    try:
        where_clause = ""
        if category == "movie":
            where_clause = "WHERE a.genre IN ('영화', '액션/모험', '액션/어드벤쳐')"
        elif category == "drama":
            where_clause = "WHERE a.genre IN ('드라마', '미니시리즈', '주말연속극')"
        
        query = text(f"""
            SELECT 
                a.full_asset_id, 
                a.asset_nm,
                COALESCE(i.poster_path, '') as poster_path
            FROM asset a
            LEFT JOIN imagedb i ON a.full_asset_id = i.full_asset_id
            {where_clause}
            ORDER BY RANDOM() 
            LIMIT :n
        """)
        
        result = db.execute(query, {"n": n})
        records = [dict(r) for r in result]
        return {"items": records}
        
    except Exception as e:
        print(f"Error: {e}")
        raise
from fastapi import APIRouter
from ...core.database import engine
import pandas as pd

router = APIRouter()

@router.get("/recommendations/random")
def get_random_recommendations(count: int = 10, type: str = None):
    where_clause = ""
    if type == "movie":
        where_clause = "WHERE a.genre IN ('영화', '액션/모험', '액션/어드벤쳐')"
    elif type == "drama":
        where_clause = "WHERE a.genre IN ('드라마', '미니시리즈', '주말연속극')"
    query = f"""
        SELECT a.full_asset_id, a.asset_nm, a.genre, a.actr_disp, 
               COALESCE(i.poster_path, '') as poster_path
        FROM asset a
        LEFT JOIN imagedb i ON a.full_asset_id = i.full_asset_id
        {where_clause}
        ORDER BY RANDOM()
        LIMIT {count}
    """
    df = pd.read_sql_query(query, engine)
    return df.to_dict('records')

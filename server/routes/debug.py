from fastapi import APIRouter
from server.db import get_connection

router = APIRouter()

@router.get("/debug/tables")
def list_tables():
    conn = get_connection()
    df = conn.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        ORDER BY table_schema, table_name
    """).fetchdf()
    return df.to_dict(orient="records")

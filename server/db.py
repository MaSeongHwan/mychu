import duckdb
from pathlib import Path

def get_connection():
    """DuckDB 연결 생성 (기존 DB 유지)"""
    db_path = Path("./server/data/my_warehouse.duckdb").resolve()
    print(f"📌 DuckDB 연결 경로: {db_path}")
    
    # 연결만 시도 (파일 수정하지 않음)
    return duckdb.connect(str(db_path), read_only=False)
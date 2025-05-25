from fastapi import APIRouter, HTTPException
from server.db import get_connection
from typing import List, Dict, Any
import json

router = APIRouter()

@router.get("/vod_mart_data")
def get_vod_mart_data():
    try:
        conn = get_connection()
        
        # Step 1: 테이블 존재 여부 확인
        check_query = """
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_name = 'vod_mart_data'
        """
        if conn.execute(check_query).fetchone()[0] == 0:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Step 2: 안전한 쿼리 작성
        query = """
            SELECT 
                COALESCE(CAST(asset_id AS VARCHAR), '') as asset_id,
                COALESCE(CAST(asset_nm AS VARCHAR), '') as asset_nm,
                COALESCE(CAST(asset_prod AS VARCHAR), '') as asset_prod,
                COALESCE(CAST(broad_ymd AS VARCHAR), '') as broad_ymd,
                COALESCE(CAST(category AS VARCHAR), '') as category,
                COALESCE(CAST(description AS VARCHAR), '') as description,
                COALESCE(CAST(ver_major AS VARCHAR), '') as ver_major,
                COALESCE(CAST(ver_minor AS VARCHAR), '') as ver_minor,
                COALESCE(CAST(vod_acq_tp_cd AS VARCHAR), '') as vod_acq_tp_cd
            FROM vod_mart_data 
            LIMIT 5
        """
        
        # Step 3: 데이터 조회
        cursor = conn.execute(query)
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        
        # Step 4: 데이터 변환
        result = []
        for row in rows:
            item = {}
            for idx, col in enumerate(columns):
                item[col] = str(row[idx]).strip() if row[idx] is not None else ''
            result.append(item)
            
        print(f"✅ 처리된 행 수: {len(result)}")
        if result:
            print("✅ 첫 번째 행:", json.dumps(result[0], ensure_ascii=False))
            
        return {
            "status": "success",
            "count": len(result),
            "data": result
        }
        
    except Exception as e:
        print(f"❌ 오류 발생: {type(e).__name__} - {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals():
            conn.close()

@router.get("/test")  # /test-db 대신 더 간단한 경로 사용
def test_connection():
    """데이터베이스 연결 및 VOD 데이터 테스트"""
    try:
        conn = get_connection()
        
        # 1. 테이블 존재 여부 확인
        result = conn.execute("""
            SELECT COUNT(*) FROM vod_mart_data
        """).fetchone()
        
        return {
            "status": "success",
            "message": "VOD 데이터 테이블 접근 성공",
            "total_rows": result[0]
        }
    except Exception as e:
        print(f"❌ 테스트 실패: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }
    finally:
        if 'conn' in locals():
            conn.close()
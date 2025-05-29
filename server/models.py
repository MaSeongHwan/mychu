import scipy.sparse as sparse
import joblib
import logging
import pandas as pd
import gc
from pathlib import Path
from data_load import load_dataframes
from sklearn.neighbors import NearestNeighbors
import psutil

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 프로젝트 루트 경로 설정
ROOT_DIR = Path(__file__).parent.parent
MODELS_DIR = ROOT_DIR / "models" / "tfidf"

def load_tfidf_model(chunk_size=1000):
    """TF-IDF 모델 로드 및 청크 기반 유사도 계산 준비"""
    try:
        if not MODELS_DIR.exists():
            raise FileNotFoundError(f"모델 디렉토리가 없습니다: {MODELS_DIR}")
            
        vectorizer_path = MODELS_DIR / "vectorizer.joblib"
        
        if not vectorizer_path.exists():
            raise FileNotFoundError("TF-IDF 모델 파일이 없습니다.")
            
        # TF-IDF 모델만 로드
        tfidf = joblib.load(vectorizer_path)
        logger.info("TF-IDF 모델 로드 완료")
        
        # NearestNeighbors 모델 초기화 (sparse matrix 지원)
        nn_model = NearestNeighbors(
            n_neighbors=10, 
            metric='cosine',
            algorithm='brute',
            n_jobs=-1
        )
        
        return tfidf, nn_model
        
    except Exception as e:
        logger.error(f"모델 로드 중 오류 발생: {e}")
        raise

## 메모리 사용량 너무 많으면 자동 종료(그램 살려죠오,,,)
def check_memory():
    """메모리 사용량 체크"""
    if psutil.virtual_memory().percent > 97:
        raise MemoryError("메모리 사용량이 97%를 초과했습니다. 프로세스를 중단합니다.")


def get_similar_items(query_id, df_assets, tfidf, nn_model, top_n=10, chunk_size=500):
    try:
        process = psutil.Process()
        initial_memory = process.memory_info().rss / 1024 / 1024

        # 쿼리 벡터 추출
        query_idx = df_assets[df_assets['full_asset_id'] == query_id].index[0]
        query_text = df_assets.loc[query_idx, 'cleaned_smry']
        query_vector = tfidf.transform([query_text])

        results = []
        total_chunks = len(df_assets) // chunk_size + 1

        for chunk_num, start_idx in enumerate(range(0, len(df_assets), chunk_size)):
            check_memory()  # ✅ 메모리 체크 추가

            end_idx = min(start_idx + chunk_size, len(df_assets))
            chunk = df_assets.iloc[start_idx:end_idx]
            logger.info(f"청크 처리 중... {chunk_num + 1}/{total_chunks}")

            chunk_vectors = tfidf.transform(chunk['cleaned_smry'].fillna(""))
            nn_model.fit(chunk_vectors)
            distances, indices = nn_model.kneighbors(query_vector)

            for dist, idx in zip(distances[0], indices[0]):
                if start_idx + idx != query_idx:
                    results.append({
                        'full_asset_id': chunk.iloc[idx]['full_asset_id'],
                        'asset_nm': chunk.iloc[idx]['asset_nm'],
                        'similarity': 1 - dist
                    })

            del chunk_vectors
            gc.collect()

            current_memory = process.memory_info().rss / 1024 / 1024
            logger.info(f"청크 {chunk_num + 1} 처리 완료. 메모리 사용량 변화: {current_memory - initial_memory:.2f}MB")

        results.sort(key=lambda x: x['similarity'], reverse=True)
        return pd.DataFrame(results[:top_n])

    except Exception as e:
        logger.error(f"유사 아이템 검색 중 오류 발생: {e}")
        raise
import sys
import os
from data_load import load_dataframes
from vectorizer import get_asset_vectors, get_similar_assets_chunked

# Add the server directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 1. 데이터프레임 로드
df_users, df_assets, df_logs = load_dataframes()

# 2. TF-IDF 벡터 생성
tfidf_matrix, tfidf = get_asset_vectors(df_assets)

# 3. 특정 콘텐츠에 대한 유사 콘텐츠 추천 (청크 기반 유사도 계산)
recommendations = get_similar_assets_chunked(
    asset_id="ASSET_000123",
    tfidf_matrix=tfidf_matrix,
    df_assets=df_assets,
    top_n=10,
    chunk_size=1000
)

# 4. 추천 결과 출력
print(recommendations[['full_asset_id', 'asset_nm', 'similarity']])

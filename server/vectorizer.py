from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import psutil
import gc

def get_asset_vectors(df_assets, max_features=500):
    """
    콘텐츠 요약 텍스트에 대해 TF-IDF 벡터를 생성합니다.
    """
    tfidf = TfidfVectorizer(max_features=max_features)
    tfidf_matrix = tfidf.fit_transform(df_assets['cleaned_smry'].fillna(""))
    return tfidf_matrix, tfidf

def get_similar_assets_chunked(asset_id, tfidf_matrix, df_assets, top_n=10, chunk_size=1000):
    """
    TF-IDF 유사도 계산을 청크 단위로 처리하여 메모리 문제 방지 + 메모리 사용량 추적
    """
    if asset_id not in df_assets['full_asset_id'].values:
        raise ValueError(f"Asset ID '{asset_id}' not found in asset list.")

    idx = df_assets.index[df_assets['full_asset_id'] == asset_id][0]
    query_vector = tfidf_matrix[idx]

    num_assets = tfidf_matrix.shape[0]
    similarities = np.empty(num_assets)
    similarities.fill(-1)

    process = psutil.Process()
    initial_memory = process.memory_info().rss / 1024 / 1024  # MB

    for start in range(0, num_assets, chunk_size):
        end = min(start + chunk_size, num_assets)
        chunk = tfidf_matrix[start:end]
        chunk_sims = cosine_similarity(query_vector.toarray(), chunk.toarray()).flatten()
        similarities[start:end] = chunk_sims
        gc.collect()

    similarities[idx] = -1

    top_indices = np.argpartition(similarities, -top_n)[-top_n:]
    top_indices = top_indices[np.argsort(similarities[top_indices])[::-1]]

    current_memory = process.memory_info().rss / 1024 / 1024
    print(f"Memory usage increased by: {current_memory - initial_memory:.2f} MB")

    top_assets = df_assets.iloc[top_indices].copy()
    top_assets["similarity"] = similarities[top_indices]

    return top_assets.reset_index(drop=True)


print("Chunked similarity function loaded successfully with memory monitoring.")

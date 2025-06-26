# import numpy as np
# import os
# import logging
# import pickle
# from pathlib import Path
# from sklearn.neighbors import NearestNeighbors

# logger = logging.getLogger("uvicorn")

# # Get the model directory
# MODEL_DIR = Path(os.path.dirname(os.path.abspath(__file__))).parent / "recommender_assets"

# class RecommenderSingleton:
#     """
#     Singleton class that manages recommendation model assets.
#     Assets are loaded once at application startup and kept in memory.
#     """
#     _instance = None
    
#     def __new__(cls):
#         if cls._instance is None:
#             logger.info("Creating RecommenderSingleton instance")
#             cls._instance = super(RecommenderSingleton, cls).__new__(cls)
#             cls._instance._initialized = False
#         return cls._instance
        
#     def __init__(self):
#         if not self._initialized:
#             logger.info("Initializing RecommenderSingleton resources")
#             self._initialized = True
            
#             # Load model assets - only happens once
#             self.hybrid_vectors = self._load_hybrid_vectors()
#             self.knn_model = self._init_knn_model()
#             self.tfidf_vectorizer = self._load_tfidf_vectorizer()
#             self.onehot_encoder = self._load_onehot_encoder()
            
#             # Content mapping
#             self.content_mapping = {
#                 "content_indices": {},
#                 "content_ids": {},
#                 "content_names": {},
#                 "is_main_map": {},
#                 "is_adult_map": {},
#                 "asset_details": {}
#             }
#             self.is_content_mapping_initialized = False
            
#     def _load_hybrid_vectors(self):
#         """하이브리드 벡터 로드"""
#         vector_path = MODEL_DIR / "hybrid_vectors(genre_emotion_smry).npy"
#         logger.info(f"Loading hybrid vectors from {vector_path}")
        
#         if not vector_path.exists():
#             logger.error(f"Vector file not found at {vector_path}")
#             logger.info("Creating dummy vectors for fallback")
#             dummy_vectors = np.random.rand(100, 50)  # 100 items, 50 dimensions
#             return dummy_vectors
            
#         try:
#             vectors = np.load(vector_path)
#             logger.info(f"Loaded hybrid vectors with shape {vectors.shape}")
#             return vectors
#         except Exception as e:
#             logger.error(f"Error loading vectors: {str(e)}")
#             # 오류 발생 시 더미 벡터 반환            return np.random.rand(100, 50)
            
#     def _init_knn_model(self):
#         """KNN 모델 초기화 - 벡터가 변경되지 않으므로 미리 fit"""
#         try:
#             logger.info("Initializing KNN model with hybrid vectors")
#             # n_neighbors 값을 50으로 설정하여 충분한 이웃을 검색하도록 함
#             knn = NearestNeighbors(n_neighbors=50, metric='cosine')
#             knn.fit(self.hybrid_vectors)
#             return knn
#         except Exception as e:
#             logger.error(f"Error initializing KNN model: {str(e)}")
#             return None
    
#     def _load_tfidf_vectorizer(self):
#         """TF-IDF 벡터라이저 로드"""
#         try:
#             path = MODEL_DIR / "tfidf_vectorizer_smry.pkl"
#             if not path.exists():
#                 logger.warning(f"TF-IDF vectorizer file not found at {path}")
#                 return None
                
#             with open(path, "rb") as f:
#                 vectorizer = pickle.load(f)
#                 logger.info("Successfully loaded TF-IDF vectorizer")
#                 return vectorizer
#         except Exception as e:
#             logger.error(f"Error loading TF-IDF vectorizer: {str(e)}")
#             return None
    
#     def _load_onehot_encoder(self):
#         """원핫 인코더 로드"""
#         try:
#             path = MODEL_DIR / "onehot_encoder_genre.pkl"
#             if not path.exists():
#                 logger.warning(f"OneHot encoder file not found at {path}")
#                 return None
                
#             with open(path, "rb") as f:
#                 encoder = pickle.load(f)
#                 logger.info("Successfully loaded OneHot encoder")
#                 return encoder
#         except Exception as e:
#             logger.error(f"Error loading OneHot encoder: {str(e)}")
#             return None
            
#     def initialize_content_mapping(self, main_assets):
#         """
#         Initialize content mapping from DB model instances.
#         Should be called only once at application startup or first API call.
#         """
#         if self.is_content_mapping_initialized:
#             logger.info("Content mapping already initialized - skipping")
#             return
            
#         logger.info(f"Initializing content mapping with {len(main_assets)} assets")
        
#         # Pre-allocate dictionaries for better performance
#         content_indices = {}
#         content_ids = {}
#         content_names = {}
#         is_main_map = {}
#         is_adult_map = {}
#         asset_details = {}
        
#         # Fill all mappings at once to avoid multiple iterations
#         for i, asset in enumerate(main_assets):
#             # Store basic mappings
#             content_indices[asset.idx] = i
#             content_ids[i] = asset.idx
#             content_names[i] = asset.asset_nm
#             is_main_map[asset.idx] = asset.is_main if hasattr(asset, 'is_main') else True  # Default to True
#             is_adult_map[asset.idx] = 0 if (not hasattr(asset, 'is_adult') or not asset.is_adult) else 1
            
#             # Store essential asset details only (avoiding full object storage)
#             asset_details[asset.idx] = {
#                 "asset_nm": asset.asset_nm,
#                 "unique_asset_id": getattr(asset, 'unique_asset_id', "") or "",
#                 "super_asset_nm": getattr(asset, 'super_asset_nm', "") or "",
#                 "is_adult": getattr(asset, 'is_adult', False) or False,
#                 "is_movie": getattr(asset, 'is_movie', False) or False, 
#                 "is_drama": getattr(asset, 'is_drama', False) or False,
#                 "is_main": getattr(asset, 'is_main', False) or False,
#                 "poster_path": getattr(asset, 'poster_path', "") or ""
#             }
        
#         # Save mappings to instance
#         self.content_mapping = {
#             "content_indices": content_indices,
#             "content_ids": content_ids,
#             "content_names": content_names,
#             "is_main_map": is_main_map,
#             "is_adult_map": is_adult_map,
#             "asset_details": asset_details
#         }
        
#         self.is_content_mapping_initialized = True
#         logger.info(f"Content mapping successfully initialized with {len(content_indices)} items")
        
#     def get_similar_contents(self, target_idx, top_n=10, include_adult=False):
#         """
#         Find similar content for a given target index.
#         Uses pre-initialized KNN model to improve performance.
#         """
#         if not self.is_content_mapping_initialized:
#             logger.error("Content mapping not initialized. Call initialize_content_mapping() first.")
#             return []
            
#         if self.knn_model is None:
#             logger.error("KNN model not initialized")
#             return []
            
#         try:
#             # Check if vector index is within range
#             vectors_count = len(self.hybrid_vectors)
#             if target_idx < 0 or target_idx >= vectors_count:
#                 logger.error(f"Vector index {target_idx} out of range (0-{vectors_count-1})")
#                 return []
                
#             # Get neighbors from pre-trained KNN model
#             distances, indices = self.knn_model.kneighbors([self.hybrid_vectors[target_idx]])
            
#             # Get necessary mappings - reference them directly to avoid copying large dictionaries
#             content_ids = self.content_mapping["content_ids"]
#             content_names = self.content_mapping["content_names"]
#             is_main_map = self.content_mapping["is_main_map"] 
#             is_adult_map = self.content_mapping["is_adult_map"]
            
#             # Track filtering metrics
#             filtered_count = 0
            
#             # Process results efficiently
#             results = []
#             for idx, dist in zip(indices[0], distances[0]):
#                 # Skip self
#                 if idx == target_idx:
#                     filtered_count += 1
#                     continue
                    
#                 # Skip if not in mapping
#                 if idx not in content_ids:
#                     filtered_count += 1
#                     continue
                    
#                 asset_id = content_ids[idx]
#                   # Apply filters (only adult filter, is_main filter removed)
#                 is_adult = is_adult_map.get(asset_id, 1) == 1
                    
#                 # Adult content filter
#                 if not include_adult and is_adult:
#                     filtered_count += 1
#                     continue
                    
#                 # Add to results
#                 results.append({
#                     "rank": len(results) + 1,
#                     "idx": asset_id,
#                     "content_nm": content_names.get(idx, f"Content {idx}"),
#                     "similarity": round(1 - dist, 4)
#                 })
                
#                 # Stop when we reach top_n
#                 if len(results) >= top_n:
#                     break
            
#             logger.info(f"get_similar_contents: Returning {len(results)} results, filtered {filtered_count}")
#             return results
            
#         except Exception as e:
#             logger.error(f"Error in get_similar_contents: {str(e)}")
#             import traceback
#             logger.error(traceback.format_exc())
#             return []

# # 싱글톤 인스턴스 생성
# recommender = RecommenderSingleton()

import numpy as np
import os
import logging
import pickle
from pathlib import Path
from sklearn.preprocessing import normalize

logger = logging.getLogger("uvicorn")

# 모델 디렉토리 설정
MODEL_DIR = Path(os.path.dirname(os.path.abspath(__file__))).parent / "recommender_assets"

class RecommenderSingleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("Creating RecommenderSingleton instance")
            cls._instance = super(RecommenderSingleton, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            logger.info("Initializing RecommenderSingleton resources")
            self._initialized = True

            # 벡터 및 모델 자산 로드
            self.hybrid_vectors = self._load_hybrid_vectors()
            self.tfidf_vectorizer = self._load_tfidf_vectorizer()
            self.onehot_encoder = self._load_onehot_encoder()

            # 콘텐츠 메타데이터 매핑 초기화
            self.content_mapping = {
                "content_indices": {},
                "content_ids": {},
                "content_names": {},
                "is_main_map": {},
                "is_adult_map": {},
                "asset_details": {}
            }
            self.is_content_mapping_initialized = False

    def _load_hybrid_vectors(self):
        """hybrid vector 파일 로드 (L2 normalize 포함)"""
        path = MODEL_DIR / "hybrid_vectors(genre_emotion_smry).npy"
        if not path.exists():
            logger.error(f"Vector file not found at {path}")
            return np.random.rand(100, 50)

        try:
            vectors = np.load(path)
            vectors = normalize(vectors, axis=1)  # 🔥 cosine 유사도용 정규화
            logger.info(f"Loaded hybrid vectors: shape={vectors.shape}")
            return vectors
        except Exception as e:
            logger.error(f"Error loading vectors: {str(e)}")
            return np.random.rand(100, 50)

    def _load_tfidf_vectorizer(self):
        try:
            path = MODEL_DIR / "tfidf_vectorizer_smry.pkl"
            if not path.exists():
                logger.warning(f"TF-IDF vectorizer not found at {path}")
                return None
            with open(path, "rb") as f:
                return pickle.load(f)
        except Exception as e:
            logger.error(f"Error loading TF-IDF vectorizer: {str(e)}")
            return None

    def _load_onehot_encoder(self):
        try:
            path = MODEL_DIR / "onehot_encoder_genre.pkl"
            if not path.exists():
                logger.warning(f"OneHot encoder not found at {path}")
                return None
            with open(path, "rb") as f:
                return pickle.load(f)
        except Exception as e:
            logger.error(f"Error loading OneHot encoder: {str(e)}")
            return None

    def initialize_content_mapping(self, main_assets):
        if self.is_content_mapping_initialized:
            logger.info("Content mapping already initialized - skipping")
            return

        logger.info(f"Initializing content mapping with {len(main_assets)} assets")

        content_indices = {}
        content_ids = {}
        content_names = {}
        is_main_map = {}
        is_adult_map = {}
        asset_details = {}

        for i, asset in enumerate(main_assets):
            content_indices[asset.idx] = i
            content_ids[i] = asset.idx
            content_names[i] = asset.asset_nm
            is_main_map[asset.idx] = getattr(asset, 'is_main', True)
            is_adult_map[asset.idx] = 1 if getattr(asset, 'is_adult', False) else 0
            asset_details[asset.idx] = {
                "asset_nm": asset.asset_nm,
                "unique_asset_id": getattr(asset, 'unique_asset_id', "") or "",
                "super_asset_nm": getattr(asset, 'super_asset_nm', "") or "",
                "is_adult": getattr(asset, 'is_adult', False) or False,
                "is_movie": getattr(asset, 'is_movie', False) or False,
                "is_drama": getattr(asset, 'is_drama', False) or False,
                "is_main": getattr(asset, 'is_main', False) or False,
                "poster_path": getattr(asset, 'poster_path', "") or ""
            }

        self.content_mapping = {
            "content_indices": content_indices,
            "content_ids": content_ids,
            "content_names": content_names,
            "is_main_map": is_main_map,
            "is_adult_map": is_adult_map,
            "asset_details": asset_details
        }
        self.is_content_mapping_initialized = True
        logger.info("Content mapping initialized")

    def get_similar_contents(self, target_idx, top_n=10, include_adult=False):
        """
        target_idx를 기준으로 가장 유사한 콘텐츠 top-N 반환 (dot-product 기반)
        """
        if not self.is_content_mapping_initialized:
            logger.error("Content mapping not initialized")
            return []

        try:
            query = self.hybrid_vectors[target_idx]  # (D,)
            sims = self.hybrid_vectors @ query.T  # (N,)
            sims[target_idx] = -1  # 자기 자신 제외

            top_indices = np.argpartition(-sims, top_n * 2)[:top_n * 2]
            top_indices = top_indices[np.argsort(-sims[top_indices])]

            content_ids = self.content_mapping["content_ids"]
            content_names = self.content_mapping["content_names"]
            is_adult_map = self.content_mapping["is_adult_map"]

            results = []
            for idx in top_indices:
                asset_id = content_ids.get(idx)
                if asset_id is None:
                    continue
                if not include_adult and is_adult_map.get(asset_id, 1):
                    continue

                results.append({
                    "rank": len(results) + 1,
                    "idx": asset_id,
                    "content_nm": content_names.get(idx, f"Content {idx}"),
                    "similarity": float(round(sims[idx], 4))
                })

                if len(results) >= top_n:
                    break

            logger.info(f"[dot] get_similar_contents: returned {len(results)} items")
            return results

        except Exception as e:
            logger.error(f"[dot] Error in get_similar_contents: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return []

# 싱글톤 인스턴스
recommender = RecommenderSingleton()

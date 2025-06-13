import numpy as np
from typing import Dict, List, Any
import os
import pickle

class RecommenderModel:
    """추천 모델 호출 클래스"""
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), '../models/tfidf')
        self.tfidf_matrix = None
        self.vectorizer = None
        self._load_model()
    
    def _load_model(self):
        """모델 파일 로드"""
        try:
            self.tfidf_matrix = np.load(os.path.join(self.model_path, 'tfidf_matrix.npz'))['matrix']
            
            with open(os.path.join(self.model_path, 'tfidf_vectorizer.pkl'), 'rb') as f:
                self.vectorizer = pickle.load(f)
                
            print("추천 모델 로드 완료")
        except Exception as e:
            print(f"모델 로드 실패: {e}")
            # 모델 없을 경우 기본 모델 제공 가능
    
    def get_item_recommendations(self, item_id: int, top_n: int = 10) -> List[Dict]:
        """아이템 기반 추천 (콘텐츠 유사도 기반)"""
        # 실제 구현에서는 콘텐츠 기반 유사도 등 활용
        return [{"id": i, "score": 0.9 - (i*0.1)} for i in range(1, top_n+1)]
    
    def get_user_recommendations(self, user_id: int, top_n: int = 10) -> List[Dict]:
        """사용자 기반 추천"""
        # 실제 구현에서는 협업 필터링 등 활용
        return [{"id": i, "score": 0.95 - (i*0.05)} for i in range(1, top_n+1)]
        
    def predict_rating(self, user_id: int, item_id: int) -> float:
        """사용자-아이템 평점 예측"""
        # 실제 구현에서는 모델 기반 예측
        return 0.8

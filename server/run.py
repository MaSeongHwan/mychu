from models import load_tfidf_model, get_similar_items
from data_load import load_dataframes
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_recommendation():
    try:
        # 1. 데이터 로드
        logger.info("데이터 로딩 시작...")
        df_users, df_assets, df_logs = load_dataframes()
        logger.info(f"데이터 로드 완료. Assets 데이터 크기: {len(df_assets)}")
        
        # 2. 모델 로드
        logger.info("TF-IDF 모델 로딩...")
        tfidf, nn_model = load_tfidf_model()
        logger.info("모델 로드 완료")
        
        # 3. 테스트 추천
        test_id = df_assets['full_asset_id'].iloc[0]  # 첫 번째 아이템으로 테스트
        logger.info(f"테스트 ID: {test_id}로 추천 시작")
        
        recommendations = get_similar_items(
            query_id=test_id,
            df_assets=df_assets,
            tfidf=tfidf,
            nn_model=nn_model,
            top_n=5,
            chunk_size=500
        )
        
        # 4. 결과 출력
        print("\n추천 결과:")
        print(recommendations[['full_asset_id', 'asset_nm', 'similarity']])
        
    except Exception as e:
        logger.error(f"테스트 중 오류 발생: {e}")
        raise

if __name__ == "__main__":
    test_recommendation()
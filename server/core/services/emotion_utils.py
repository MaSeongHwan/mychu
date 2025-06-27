# server/core/services/emotion_utils.py

import numpy as np
from sqlalchemy.orm import Session
from sklearn.metrics.pairwise import cosine_similarity
from server.models.user import VodLog
from server.models.asset import Asset, AssetEmotion


def get_user_emotion_vector(db: Session, user_id: int):
    """
    유저가 본 콘텐츠의 감정 벡터 평균을 구함.
    """
    logs = (
        db.query(VodLog)
        .join(AssetEmotion, VodLog.asset_idx == AssetEmotion.idx)
        .filter(VodLog.user_idx == user_id)
        .all()
    )

    if not logs:
        return None

    emotion_keys = [
        'emotion_anger', 'emotion_anticipation', 'emotion_disgust', 'emotion_fear',
        'emotion_joy', 'emotion_negative', 'emotion_positive', 'emotion_sadness',
        'emotion_surprise', 'emotion_trust'
    ]

    vectors = []
    for log in logs:
        asset_emotion = log.asset.emotion
        vec = [getattr(asset_emotion, key, 0.0) or 0.0 for key in emotion_keys]
        vectors.append(vec)

    if not vectors:
        return None

    user_vector = np.mean(vectors, axis=0)
    return user_vector


def recommend_by_emotion(db: Session, user_vector, top_k=10):
    """
    코사인 유사도 기반으로 감정 유사한 콘텐츠 추천
    """
    all_assets = (
        db.query(Asset)
        .join(AssetEmotion, Asset.idx == AssetEmotion.idx)
        .filter(Asset.is_main == True, Asset.is_adult == False)
        .all()
    )

    emotion_keys = [
        'emotion_anger', 'emotion_anticipation', 'emotion_disgust', 'emotion_fear',
        'emotion_joy', 'emotion_negative', 'emotion_positive', 'emotion_sadness',
        'emotion_surprise', 'emotion_trust'
    ]

    asset_vectors = []
    asset_objs = []
    for asset in all_assets:
        vec = [getattr(asset.emotion, key, 0.0) or 0.0 for key in emotion_keys]
        asset_vectors.append(vec)
        asset_objs.append(asset)

    sims = cosine_similarity([user_vector], asset_vectors)[0]
    top_indices = sims.argsort()[::-1][:top_k]

    recommended = [asset_objs[i] for i in top_indices]
    dominant_emotion = emotion_keys[np.argmax(user_vector)]

    return recommended, dominant_emotion

def get_dominant_emotion_from_recent_logs(db: Session, user_id: int, top_n: int = 5):
    """
    유저의 최근 시청 로그 중 감정 스코어가 가장 높은 감정을 dominant emotion으로 반환
    """
    from server.models.asset import AssetEmotion
    from server.models.user import VodLog

    emotion_keys = [
        'emotion_anger', 'emotion_anticipation', 'emotion_disgust', 'emotion_fear',
        'emotion_joy', 'emotion_negative', 'emotion_positive', 'emotion_sadness',
        'emotion_surprise', 'emotion_trust'
    ]

    logs = (
        db.query(*[getattr(AssetEmotion, key) for key in emotion_keys])
        .join(VodLog, VodLog.asset_idx == AssetEmotion.idx)
        .filter(VodLog.user_idx == user_id)
        .order_by(VodLog.strt_dt.desc())
        .limit(top_n)
        .all()
    )

    if not logs:
        return None

    emotion_array = np.array(logs)
    avg_vector = emotion_array.mean(axis=0)
    dominant_idx = np.argmax(avg_vector)
    dominant_emotion = emotion_keys[dominant_idx].replace("emotion_", "")
    return dominant_emotion


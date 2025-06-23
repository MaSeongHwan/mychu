import os

def set_firebase_credentials():
    """Firebase Admin SDK의 환경 변수를 설정합니다."""
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        'firebase-key.json'
    )

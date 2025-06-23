import firebase_admin
from firebase_admin import credentials, auth
import os
from pathlib import Path
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 서버 루트 디렉토리 경로 설정
SERVER_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def init_firebase():
    try:
        if not firebase_admin._apps:  # Firebase가 초기화되지 않은 경우에만 초기화
            # 서비스 계정 키 경로 설정
            firebase_cred_path = os.path.join(SERVER_ROOT, 'config', 'bootcamp-19343-firebase-adminsdk-fbsvc-68deb04c7c.json')
            if not os.path.exists(firebase_cred_path):
                raise FileNotFoundError(f"Firebase credential file not found at {firebase_cred_path}")

            # 상대 경로를 절대 경로로 변환
            abs_cred_path = os.path.abspath(firebase_cred_path)
            if not os.path.exists(abs_cred_path):
                raise FileNotFoundError(f"Firebase credential file not found at {abs_cred_path}")

            # Firebase Admin SDK 초기화
            cred = credentials.Certificate(abs_cred_path)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully")
            
    except Exception as e:
        print(f"Firebase initialization error: {e}")
        raise

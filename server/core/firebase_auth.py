import firebase_admin
from firebase_admin import credentials, auth
import os
from pathlib import Path
import logging

from server.config.settings import FIREBASE_CREDENTIAL_PATH

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_firebase():
    try:
        if not firebase_admin._apps:  # Firebase가 초기화되지 않은 경우에만 초기화
            # 서비스 계정 키 경로 설정
            firebase_cred_path = FIREBASE_CREDENTIAL_PATH
            
            # 절대 경로로 변환
            abs_cred_path = os.path.abspath(firebase_cred_path)
            
            logger.info(f"Looking for Firebase credential at: {abs_cred_path}")
            
            if not os.path.exists(abs_cred_path):
                # 다른 가능한 경로 시도
                project_root = Path(__file__).resolve().parent.parent.parent
                alternative_paths = [
                    project_root / "server" / "config" / "bootcamp-19343-firebase-adminsdk-fbsvc-68deb04c7c.json",
                    project_root / "config" / "bootcamp-19343-firebase-adminsdk-fbsvc-68deb04c7c.json",
                    Path("./server/config/bootcamp-19343-firebase-adminsdk-fbsvc-68deb04c7c.json").absolute()
                ]
                
                for path in alternative_paths:
                    logger.info(f"Trying alternative path: {path}")
                    if path.exists():
                        abs_cred_path = str(path)
                        logger.info(f"Found credential at: {abs_cred_path}")
                        break
                else:
                    raise FileNotFoundError(f"Firebase credential file not found in any of the usual locations.")

            # Firebase Admin SDK 초기화
            cred = credentials.Certificate(abs_cred_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
            return True
            
    except Exception as e:
        logger.error(f"Firebase initialization error: {e}")
        raise

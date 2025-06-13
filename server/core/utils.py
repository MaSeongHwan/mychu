from cryptography.fernet import Fernet
import os
from pathlib import Path
from datetime import datetime

# 해시 함수, 암호화 유틸리티
def get_or_create_key():
    key_path = Path(__file__).parent / '.key'
    if not key_path.exists():
        key = Fernet.generate_key()
        with open(key_path, 'wb') as f:
            f.write(key)
    else:
        with open(key_path, 'rb') as f:
            key = f.read()
    return key

def get_crypto():
    key = get_or_create_key()
    return Fernet(key)

def encrypt_token(token: str) -> str:
    f = get_crypto()
    return f.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    f = get_crypto()
    return f.decrypt(encrypted_token.encode()).decode()

# 타임스탬프 유틸리티
def get_current_timestamp():
    """현재 UTC 타임스탬프를 반환합니다."""
    return datetime.utcnow()

def format_timestamp(timestamp, format_str="%Y-%m-%d %H:%M:%S"):
    """타임스탬프를 지정된 포맷으로 변환합니다."""
    return timestamp.strftime(format_str)

# 기타 공통 유틸리티 함수들
def safe_dict_get(dict_obj, key, default=None):
    """딕셔너리에서 안전하게 값을 가져오는 헬퍼 함수"""
    return dict_obj.get(key, default)

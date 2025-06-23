from cryptography.fernet import Fernet
import os
from pathlib import Path

def get_or_create_key():
    key_path = Path(__file__).parent.parent / '.key'
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

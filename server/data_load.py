import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

def load_dataframes():
    load_dotenv()
    
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME")
    
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(DATABASE_URL)
    
    df_users = pd.read_sql_table('users', engine)
    df_assets = pd.read_sql_table('asset', engine)
    df_logs = pd.read_sql_table('log', engine)
    df_images = pd.read_sql_table('imagedb', engine)

    return df_users, df_assets, df_logs, df_images
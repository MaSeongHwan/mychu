from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import logging
from server.config.settings import DATABASE_URL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """데이터베이스 초기화 및 연결 테스트"""
    try:
        # Import models inside the function to avoid circular imports
        from server.models.user import User
        from server.models.asset import Asset
        from server.models.log import Product, ProductKeyword
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Successfully initialized database")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

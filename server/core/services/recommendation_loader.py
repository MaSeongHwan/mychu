from pathlib import Path
import pickle
import numpy as np
import logging
import os

logger = logging.getLogger("uvicorn")

# Get the model directory path
MODEL_DIR = Path(__file__).resolve().parent.parent / "recommender_assets"

# Ensure the directory exists
if not MODEL_DIR.exists():
    logger.warning(f"Model directory {MODEL_DIR} does not exist, creating it")
    try:
        os.makedirs(MODEL_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Failed to create model directory: {str(e)}")

def load_hybrid_vectors():
    """
    Load pre-trained hybrid vectors that combine genre, emotion, and summary embeddings
    """
    vector_path = MODEL_DIR / "hybrid_vectors(genre_emotion_smry).npy"
    logger.info(f"Loading hybrid vectors from {vector_path}")
    
    if not vector_path.exists():
        logger.error(f"Vector file not found at {vector_path}")
        logger.info("Creating dummy vectors for fallback")
        # Create a small dummy vector file for testing
        dummy_vectors = np.random.rand(100, 50)  # 100 items, 50 dimensions
        try:
            np.save(vector_path, dummy_vectors)
            logger.info(f"Created dummy vectors at {vector_path}")
        except Exception as e:
            logger.error(f"Failed to create dummy vectors: {str(e)}")
        return dummy_vectors
        
    try:
        vectors = np.load(vector_path)
        logger.info(f"Loaded vectors with shape {vectors.shape}")
        return vectors
    except Exception as e:
        logger.error(f"Error loading vectors: {str(e)}")
        # Return a small dummy array as fallback
        return np.random.rand(100, 50)

def load_tfidf_vectorizer():
    """
    Load trained TF-IDF vectorizer for text processing
    """
    with open(MODEL_DIR / "tfidf_vectorizer_smry.pkl", "rb") as f:
        return pickle.load(f)

def load_onehot_encoder():
    """
    Load trained OneHot encoder for genre processing
    """
    with open(MODEL_DIR / "onehot_encoder_genre.pkl", "rb") as f:
        return pickle.load(f)

def load_emotion_dict():
    """
    Load emotion dictionary for emotion-based filtering
    """
    path = MODEL_DIR / "emotion_dict_nrc.pkl"
    if path.exists():
        with open(path, "rb") as f:
            return pickle.load(f)
    return {}

def load_content_mapping():
    """
    Load mapping between content indices and metadata
    If file doesn't exist, return empty dictionaries
    """
    path = MODEL_DIR / "content_mapping.pkl"
    if path.exists():
        with open(path, "rb") as f:
            return pickle.load(f)
    return {}, {}, {}, {}  # content_ids, content_names, is_main_map, is_adult_map

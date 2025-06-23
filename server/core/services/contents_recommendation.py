from sklearn.neighbors import NearestNeighbors
import pandas as pd
import numpy as np
import logging
from .recommendation_loader import load_hybrid_vectors

logger = logging.getLogger("uvicorn")

# Try to load vectors, but provide a fallback if loading fails
try:
    hybrid_vectors = load_hybrid_vectors()
    logger.info(f"Successfully loaded hybrid vectors with shape {hybrid_vectors.shape if isinstance(hybrid_vectors, np.ndarray) else 'unknown'}")
except Exception as e:
    logger.error(f"Failed to load hybrid vectors: {str(e)}")
    # Provide a small dummy vector array for fallback
    hybrid_vectors = np.random.rand(10, 50)
    logger.warning(f"Using fallback random vectors with shape {hybrid_vectors.shape}")

def get_similar_contents_hybrid_filtered(
    target_idx,
    content_ids,
    content_names,
    is_main_map,
    is_adult_map,
    top_n=10
):
    """
    Get similar content based on hybrid vectors using KNN
    
    Args:
        target_idx: Index of the target content in hybrid_vectors
        content_ids: Mapping of vector indices to asset IDs
        content_names: Mapping of vector indices to content names
        is_main_map: Mapping of asset IDs to is_main flag
        is_adult_map: Mapping of asset IDs to is_adult flag (0=not adult, 1=adult)
        top_n: Number of recommendations to return
        
    Returns:
        List of recommendation items with rank, idx, content_nm, and similarity
    """
    try:
        logger.info(f"Finding similar contents for target_idx={target_idx}, top_n={top_n}")
        
        # Validate target_idx is in range
        if target_idx < 0 or target_idx >= len(hybrid_vectors):
            logger.error(f"Target index {target_idx} out of range (0-{len(hybrid_vectors)-1})")
            return []
            
        # Make sure we don't request more neighbors than we have vectors
        n_neighbors = min(len(hybrid_vectors), max(top_n * 5, 20))
        logger.info(f"Using n_neighbors={n_neighbors} for KNN")
        
        knn = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        knn.fit(hybrid_vectors)
        distances, indices = knn.kneighbors([hybrid_vectors[target_idx]])

        results = []
        for idx, dist in zip(indices[0], distances[0]):
            # Skip the target item itself
            if idx == target_idx:
                continue
                
            # Validate the index is in our mappings
            if idx not in content_ids:
                logger.warning(f"Index {idx} not in content_ids mapping")
                continue
                
            asset_id = content_ids[idx]
            
            # Apply filters based on is_main and is_adult
            # Default to False for is_main and 1 for is_adult if not in maps
            is_main = is_main_map.get(asset_id, False)
            is_not_adult = is_adult_map.get(asset_id, 1) == 0
            
            # Skip items that don't match our filters
            if not (is_main and is_not_adult):
                continue
                
            # Add to results
            results.append({
                "rank": len(results) + 1,
                "idx": asset_id,
                "content_nm": content_names.get(idx, f"Content {idx}"),
                "similarity": round(1 - dist, 4)
            })
            
            # Stop when we reach top_n
            if len(results) >= top_n:
                logger.info(f"Reached top_n={top_n} results, stopping")
                break
        
        logger.info(f"Found {len(results)} similar contents after filtering")
        return results
        
    except Exception as e:
        logger.error(f"Error in get_similar_contents_hybrid_filtered: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        # Return an empty list instead of raising an exception
        return []
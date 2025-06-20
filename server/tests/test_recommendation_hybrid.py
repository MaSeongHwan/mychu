import pytest
from fastapi.testclient import TestClient
from server.main import app
from unittest.mock import patch, MagicMock
import numpy as np

client = TestClient(app)

@pytest.fixture
def mock_db_session():
    """Create a mock DB session for testing"""
    mock_session = MagicMock()
    
    # Mock Asset objects
    mock_assets = []
    for i in range(1, 11):
        mock_asset = MagicMock()
        mock_asset.idx = i
        mock_asset.asset_nm = f"Test Asset {i}"
        mock_asset.is_main = True
        mock_asset.is_adult = i % 5 == 0  # Every 5th asset is adult content
        mock_assets.append(mock_asset)
    
    # Setup the query return values
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_assets[0]  # First asset
    mock_query.all.return_value = mock_assets
    
    mock_session.query.return_value = mock_query
    return mock_session

@patch("server.api.routes.recommendation_hybrid.get_db")
@patch("server.core.services.contents_recommendation.hybrid_vectors", np.random.rand(10, 128))
def test_get_similar_content(mock_get_db, mock_db_session):
    """Test the similar content recommendation endpoint"""
    mock_get_db.return_value = mock_db_session
    
    # Test successful recommendation
    response = client.get("/recommendation/similar/1?top_n=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) <= 5
    
    # Test non-existent asset
    mock_db_session.query.return_value.filter.return_value.first.return_value = None
    response = client.get("/recommendation/similar/999")
    assert response.status_code == 404
    
if __name__ == "__main__":
    # Simple manual test for debugging
    # Run with: python -m server.tests.test_recommendation_hybrid
    test_get_similar_content()
    print("All tests passed!")

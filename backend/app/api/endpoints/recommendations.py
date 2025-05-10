# app/api/endpoints/recommendations.py
from fastapi import APIRouter, HTTPException, Depends
from typing import Any, List # Import List
from sentence_transformers import SentenceTransformer

from app.models import RecommendationResponse, UserPreferences, Movie # Import Movie
from app.crud import get_ai_recommendations_from_db
from app.core.config import settings
import torch

# --- Load Model ---
try:
    print(f"Loading sentence transformer model ({settings.SENTENCE_MODEL_NAME}) for recommendations endpoint...")
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    st_model_instance_reco = SentenceTransformer(settings.SENTENCE_MODEL_NAME, device=device)
    print("Recommendation sentence transformer model loaded successfully.")
except Exception as e:
    print(f"ERROR: Failed to load Sentence Transformer model for recommendations: {e}")
    st_model_instance_reco = None

# --- API Router ---
router = APIRouter()

@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations_endpoint(
    *,
    preferences: UserPreferences
) -> Any:
    """
    Endpoint to get movie recommendations using Sentence Embeddings.
    """
    if st_model_instance_reco is None:
         raise HTTPException(status_code=503, detail="Recommendation model is not available.")

    try:
        # This list contains Movie Beanie Document instances
        recommended_movies_list: List[Movie] = await get_ai_recommendations_from_db(
            preferences,
            st_model_instance_reco
        )

        # --- MODIFIED SECTION ---
        # Convert each Movie Document in the list to a JSON-serializable dict
        # This ensures ObjectId('...') becomes "..." for the 'id' field
        movies_for_response = [
            movie.model_dump(mode='json') for movie in recommended_movies_list
        ]

        # Return the RecommendationResponse containing the list of dictionaries
        return RecommendationResponse(movies=movies_for_response)
        # --- END OF MODIFICATION ---

    except Exception as e:
        print(f"Error during recommendation generation in endpoint: {type(e).__name__} - {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while generating recommendations.")
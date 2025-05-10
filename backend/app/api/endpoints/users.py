# app/api/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Response
from typing import Any, List

from app.api.deps import get_current_active_user
from app.models import User, Movie
from app.schemas.user import UserPublic
from beanie.operators import AddToSet, Pull
# Import DocumentNotFound potentially if needed for get
from beanie.exceptions import DocumentNotFound

router = APIRouter()

@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: User = Depends(get_current_active_user)) -> Any:
    return current_user.model_dump(mode='json')

@router.get("/me/favorites", response_model=List[int])
async def get_user_favorites(current_user: User = Depends(get_current_active_user)) -> List[int]:
    return current_user.favorite_movie_ids

@router.post("/me/favorites/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_movie_to_favorites(
    movie_id: int,
    current_user: User = Depends(get_current_active_user),
):
    """
    Add a movie (by its integer movie_id) to the current user's favorites.
    Uses $addToSet to avoid duplicates. Returns 204 No Content on success.
    """
    # Check if movie exists
    movie_exists = await Movie.find_one(Movie.movie_id == movie_id)
    if not movie_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with ID {movie_id} not found."
        )

    # --- MODIFIED UPDATE LOGIC ---
    # Find user by ID and apply update operator directly
    try:
        update_result = await User.find_one(User.id == current_user.id).update(
            AddToSet({User.favorite_movie_ids: movie_id})
        )
        # Check if document was found and potentially modified
        # Note: find_one().update() might not return modified_count directly
        # We might need find_one + save or use Motor directly for detailed results.
        # For simplicity, assume success if no exception.
        # Re-fetch to confirm if needed, but let's rely on exception handling first.

    except Exception as e:
        # Log the error for debugging
        print(f"Error adding favorite {movie_id} for user {current_user.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not add favorite movie."
        )
    # --- END MODIFICATION ---

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/me/favorites/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_movie_from_favorites(
    movie_id: int,
    current_user: User = Depends(get_current_active_user),
):
    """
    Remove a movie (by its integer movie_id) from the current user's favorites.
    Uses $pull. Returns 204 No Content on success.
    """
     # --- MODIFIED UPDATE LOGIC ---
     # Find user by ID and apply update operator directly
    try:
        update_result = await User.find_one(User.id == current_user.id).update(
            Pull({User.favorite_movie_ids: movie_id})
        )
        # Add checks if needed based on update_result if the method returns useful info
    except Exception as e:
        # Log the error for debugging
        print(f"Error removing favorite {movie_id} for user {current_user.email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not remove favorite movie."
        )
    # --- END MODIFICATION ---

    return Response(status_code=status.HTTP_204_NO_CONTENT)
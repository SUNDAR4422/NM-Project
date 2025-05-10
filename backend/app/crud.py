# app/crud.py
import asyncio
from typing import List, Dict, Any, Tuple, Optional
from .models import Movie, UserPreferences
from beanie.odm.operators.find.comparison import In
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# get_ai_recommendations_from_db function:
async def get_ai_recommendations_from_db(
    preferences: UserPreferences,
    st_model: SentenceTransformer
) -> List[Movie]:
    """
    Generates movie recommendations based on user preferences,
    using MongoDB for initial filtering and Sentence Embeddings for semantic ranking.
    """
    print(f"Generating recommendations using embeddings for: {preferences.model_dump()}")

    # --- Step 1: Initial Filtering using MongoDB ---
    query_conditions = []

    if preferences.language:
         query_conditions.append(Movie.language == preferences.language)
    if preferences.duration != 999:
         query_conditions.append(Movie.duration <= preferences.duration)
    if preferences.genres:
        query_conditions.append(In(Movie.genres, preferences.genres))

    # Build the final query
    if query_conditions:
        final_query = Movie.find(*query_conditions)
    else:
         final_query = Movie.find_all()

    # --- REMOVED .project({...}) call ---
    # Beanie fetches all fields defined in the Movie model by default now.

    # Execute query to get candidate movies
    candidate_movies = await final_query.limit(500).to_list() # Limit applied directly
    print(f"Found {len(candidate_movies)} candidate movies after initial DB filtering (using genres only).")

    if not candidate_movies:
        print("No movies found matching the specified genres.")
        return []

    # --- Step 2: Filter candidates with embeddings ---
    movies_with_embeddings = [m for m in candidate_movies if m.description_embedding]
    if not movies_with_embeddings:
        print("WARNING: No candidate movies have embeddings. Re-run 'scripts/generate_embeddings.py' on the new dataset.")
        print("Returning list sorted by rating as fallback.")
        # Fallback: sort original candidates by rating (descending)
        candidate_movies.sort(key=lambda m: m.rating or 0, reverse=True)
        # Apply post-filtering based on preferences flags
        final_list = []
        if preferences.preferences:
            temp_filtered_list = []
            for movie in candidate_movies: # Use original candidates if no embeddings
                match = False
                if 'trending' in preferences.preferences and movie.isTrending: match = True
                if not match and 'classic' in preferences.preferences and movie.isClassic: match = True
                if not match and 'hidden_gems' in preferences.preferences and movie.isHiddenGem: match = True
                if match: temp_filtered_list.append(movie)
            final_list = temp_filtered_list
        else:
            final_list = candidate_movies
        return final_list[:12] # Return top 10 based on rating

    # --- Step 3: Generate Query Embedding ---
    query_text = " ".join(preferences.genres).lower()
    query_text_with_mood = f"{preferences.mood} feeling movie in genres: {query_text}"
    print(f"Generating embedding for query: '{query_text_with_mood}'")
    query_embedding = st_model.encode(query_text_with_mood, convert_to_numpy=True)

    # --- Step 4: Calculate Similarities ---
    movie_embeddings = np.array([m.description_embedding for m in movies_with_embeddings])
    if movie_embeddings.size == 0:
        print("Warning: Extracted movie embeddings array is empty.")
        ranked_movies_by_ai = movies_with_embeddings
        similarities = None
    else :
        try:
            similarities = cosine_similarity(query_embedding.reshape(1, -1), movie_embeddings)[0]
        except Exception as e:
            print(f"Error during cosine similarity calculation: {e}")
            ranked_movies_by_ai = movies_with_embeddings
            similarities = None

    # --- Step 5: Rank Movies ---
    if similarities is not None:
        scored_movies = []
        for i, movie in enumerate(movies_with_embeddings):
            scored_movies.append({'movie': movie, 'score': similarities[i]})
        scored_movies.sort(key=lambda x: x['score'], reverse=True)
        ranked_movies_by_ai = [item['movie'] for item in scored_movies]
        print(f"Ranked {len(ranked_movies_by_ai)} movies using embedding similarity.")
    # If similarities calculation failed, ranked_movies_by_ai has pre-ranked list from step 4 fallback

    # --- Step 6: Post-Filtering (Classic, Trending, etc.) ---
    final_recommended_movies = []
    if preferences.preferences:
        temp_filtered_list = []
        for movie in ranked_movies_by_ai: # Apply to the potentially ranked list
            match = False
            if 'trending' in preferences.preferences and movie.isTrending: match = True
            if not match and 'classic' in preferences.preferences and movie.isClassic: match = True
            if not match and 'hidden_gems' in preferences.preferences and movie.isHiddenGem: match = True
            if match: temp_filtered_list.append(movie)
        final_recommended_movies = temp_filtered_list
        print(f"Applied post-AI preference flags, {len(final_recommended_movies)} movies remain.")
    else:
        final_recommended_movies = ranked_movies_by_ai

    return final_recommended_movies[:12]
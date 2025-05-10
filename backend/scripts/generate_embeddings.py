# movie_reco_backend/scripts/generate_embeddings.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from sentence_transformers import SentenceTransformer
import sys
import os
from tqdm import tqdm # For progress bar

# --- Configuration ---
MONGODB_CONNECTION_STRING = "mongodb://localhost:27017"  # !!! REPLACE WITH YOURS !!!
DATABASE_NAME = "movie_db"
# Choose a sentence transformer model (e.g., 'all-MiniLM-L6-v2' is efficient)
MODEL_NAME = 'all-MiniLM-L6-v2'

# Adjust path to import Movie model
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from app.models import Movie

async def generate_and_store_embeddings():
    print(f"Connecting to MongoDB: {MONGODB_CONNECTION_STRING}, Database: {DATABASE_NAME}")
    client = AsyncIOMotorClient(MONGODB_CONNECTION_STRING)
    db_instance = client[DATABASE_NAME]
    await init_beanie(database=db_instance, document_models=[Movie])
    print("Beanie initialized.")

    print(f"Loading Sentence Transformer model: {MODEL_NAME}...")
    # This might take a moment the first time to download the model
    # Specify device='cuda' if you have a compatible GPU and torch with CUDA installed
    model = SentenceTransformer(MODEL_NAME, device='cpu')
    print("Model loaded.")

    # Fetch all movies that don't have an embedding yet or need updating
    # Fetching all might be easier if the script is run infrequently
    print("Fetching all movies from database...")
    movies_to_process = await Movie.find_all().to_list()
    print(f"Found {len(movies_to_process)} movies.")

    if not movies_to_process:
        print("No movies found to process.")
        client.close()
        return

    updates_count = 0
    errors_count = 0
    print("Generating embeddings and updating documents...")

    # Process movies (consider batching for very large datasets)
    for movie in tqdm(movies_to_process, desc="Processing movies"):
        try:
            # Create text to embed (handle missing description)
            text_to_embed = movie.description if movie.description else movie.title
            if not text_to_embed: # Skip if no text available
                continue

            # Generate embedding
            embedding = model.encode(text_to_embed, convert_to_numpy=True).tolist() # Convert to list for MongoDB

            # Update the movie document
            await Movie.find_one(Movie.movie_id == movie.movie_id).update(
                {"$set": {Movie.description_embedding: embedding}}
            )
            updates_count += 1

        except Exception as e:
            print(f"\nError processing movie '{movie.title}' (ID: {movie.movie_id}): {e}")
            errors_count += 1

    print("\n------------------------------------")
    print(f"Embedding generation complete.")
    print(f"Successfully updated embeddings for {updates_count} movies.")
    if errors_count > 0:
        print(f"Encountered errors for {errors_count} movies.")
    print("------------------------------------")

    client.close()
    print("MongoDB connection closed.")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(generate_and_store_embeddings())
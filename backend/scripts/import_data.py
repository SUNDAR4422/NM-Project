# movie_reco_backend/scripts/import_data.py
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys
import os

# Adjust the path to import Movie from your app.models
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from app.models import Movie # Your Beanie Movie document

# --- Configuration ---
MONGODB_CONNECTION_STRING = "mongodb://localhost:27017"  # !!! REPLACE WITH YOURS !!!
DATABASE_NAME = "movie_db"
JSON_FILE_PATH = os.path.join(project_root, "data", "movies.json")

async def import_movies():
    print(f"Connecting to MongoDB: {MONGODB_CONNECTION_STRING}, Database: {DATABASE_NAME}")
    client = AsyncIOMotorClient(MONGODB_CONNECTION_STRING)
    db_instance = client[DATABASE_NAME] 
    
    await init_beanie(database=db_instance, document_models=[Movie])
    print("Beanie initialized.")

    # --- ADD THIS: Clear existing movies to avoid duplicates and ensure fresh import ---
    print(f"Attempting to clear existing movies from the '{Movie.Settings.name}' collection...")
    delete_result = await Movie.get_motor_collection().delete_many({})
    print(f"Existing movies cleared. {delete_result.deleted_count} documents deleted.")
    # --- END OF ADDED SECTION ---

    print(f"Loading movies from JSON file: {JSON_FILE_PATH}")
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            movies_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: JSON file not found at {JSON_FILE_PATH}")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {JSON_FILE_PATH}")
        return

    movies_to_insert_pydantic = [] # Renamed for clarity
    skipped_count = 0
    for movie_dict_from_json in movies_data: # Renamed for clarity
        if 'id' not in movie_dict_from_json:
            print(f"Skipping movie due to missing 'id' in JSON: {movie_dict_from_json.get('title', 'N/A')}")
            skipped_count +=1
            continue
        
        # Create a new dictionary for the Pydantic model to avoid modifying original
        current_movie_data_for_model = movie_dict_from_json.copy()
        current_movie_data_for_model['movie_id'] = current_movie_data_for_model.pop('id') 

        try:
            movie_pydantic_obj = Movie(**current_movie_data_for_model)
            movies_to_insert_pydantic.append(movie_pydantic_obj)
        except Exception as e: 
            print(f"Skipping movie due to Pydantic validation error for '{current_movie_data_for_model.get('title', 'N/A')}': {e}")
            skipped_count +=1
            
    # --- ADD THIS: Debug print for the first movie object before insertion ---
    if movies_to_insert_pydantic:
        print("\nData for the first movie object to be inserted (after Pydantic validation):")
        print(movies_to_insert_pydantic[0].model_dump_json(indent=2)) # Pydantic v2
        # If using Pydantic v1, it would be movies_to_insert_pydantic[0].json(indent=2)
        print("--- End of first movie object data ---\n")
    # --- END OF ADDED SECTION ---

    if movies_to_insert_pydantic:
        print(f"Attempting to insert {len(movies_to_insert_pydantic)} validated Pydantic movie objects into MongoDB...")
        try:
            await Movie.insert_many(movies_to_insert_pydantic)
            print(f"Successfully inserted {len(movies_to_insert_pydantic)} movies.")
        except Exception as e:
            print(f"Error during bulk insert: {e}")
    else:
        print("No valid movie objects to insert.")
    
    if skipped_count > 0:
        print(f"Skipped {skipped_count} movies from JSON due to missing 'id' or data errors.")

    # It's good practice to close the client when the script is done
    client.close() # Close the motor client
    print("MongoDB connection closed by script.")


if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(import_movies())
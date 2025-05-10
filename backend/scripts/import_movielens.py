# movie_reco_backend/scripts/import_movielens.py
import asyncio
import csv
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys
import os
from tqdm import tqdm
from typing import Optional, List, Tuple # <-- Import Optional here

# --- Configuration ---
MONGODB_CONNECTION_STRING = "mongodb://localhost:27017"  # !!! REPLACE WITH YOURS !!!
DATABASE_NAME = "movie_db"
# Path to the MovieLens movies.csv file (inside data/ml-latest-small/)
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'ml-latest-small', 'mov.csv')

# Adjust path to import Movie model
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from app.models import Movie # Your Beanie Movie document

def parse_genres(genres_str: str) -> list[str]:
    """Splits the pipe-separated genres string into a list."""
    if genres_str == "(no genres listed)":
        return []
    return genres_str.split('|')

def parse_title_year(title_str: str) -> Tuple[str, Optional[int]]: # <-- Optional used here
    """Extracts year from title string like 'Movie Title (YYYY)'."""
    year = None
    title = title_str.strip()
    # Check if year pattern exists at the end
    if title.endswith(")") and len(title) >= 7 and title[-5] == '(':
        try:
            year_str = title[-5:-1]
            # Check if it's likely a year (e.g., 4 digits)
            if len(year_str) == 4 and year_str.isdigit():
                year = int(year_str)
                # Remove year and surrounding spaces/parentheses from title
                title = title[:-6].strip()
            # Handle cases like "(Action)" or "(III)" which might be at the end
            # For now, if it doesn't look like a year, we keep the original title
        except ValueError:
            pass # Year parsing failed, keep original title and year=None
    return title, year


async def import_movielens_data():
    print(f"Connecting to MongoDB: {MONGODB_CONNECTION_STRING}, Database: {DATABASE_NAME}")
    client = AsyncIOMotorClient(MONGODB_CONNECTION_STRING)
    db_instance = client[DATABASE_NAME]
    await init_beanie(database=db_instance, document_models=[Movie])
    print("Beanie initialized.")

    print(f"Attempting to clear existing movies from the '{Movie.Settings.name}' collection...")
    delete_result = await Movie.get_motor_collection().delete_many({})
    print(f"Existing movies cleared. {delete_result.deleted_count} documents deleted.")

    print(f"Loading movies from CSV file: {CSV_FILE_PATH}")
    movies_to_insert = []
    skipped_count = 0

    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in tqdm(reader, desc="Reading CSV"):
                try:
                    movie_id_int = int(row['movieId'])
                    title, year = parse_title_year(row['title'])
                    genres = parse_genres(row['genres'])

                    movie_data = {
                        "movie_id": movie_id_int,
                        "title": title,
                        "year": year, # Can be None
                        "genres": genres,
                        "posterUrl": None, "backdropUrl": None, "rating": None,
                        "duration": None, "description": None, "language": None,
                        "streamingOn": None, "isClassic": False, "isHiddenGem": False,
                        "isTrending": False, "description_embedding": None
                    }
                    movie_obj = Movie(**movie_data)
                    movies_to_insert.append(movie_obj)

                except Exception as e:
                    print(f"\nSkipping row due to processing error: {row}. Error: {e}")
                    skipped_count += 1

    except FileNotFoundError:
        print(f"Error: CSV file not found at {CSV_FILE_PATH}")
        client.close()
        return
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        client.close()
        return

    batch_size = 500
    print(f"\nAttempting to insert {len(movies_to_insert)} movies into MongoDB in batches of {batch_size}...")
    inserted_count = 0
    for i in tqdm(range(0, len(movies_to_insert), batch_size), desc="Inserting batches"):
        batch = movies_to_insert[i:i + batch_size]
        try:
            await Movie.insert_many(batch)
            inserted_count += len(batch)
        except Exception as e:
            print(f"\nError during batch insert (starting index {i}): {e}")

    print("\n------------------------------------")
    print(f"Data import complete.")
    print(f"Successfully inserted {inserted_count} movies.")
    if skipped_count > 0:
        print(f"Skipped {skipped_count} rows due to errors during processing.")
    print("------------------------------------")

    client.close()
    print("MongoDB connection closed.")


if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(import_movielens_data())
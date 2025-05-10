# scripts/enrich_movie_data.py
import asyncio
import csv
import requests # For making HTTP requests
import time # For rate limiting
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys
import os
from tqdm import tqdm

# --- Configuration ---
# Load config which should now include TMDB key from .env
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from app.core.config import settings # Import settings
from app.models import Movie # Your Beanie Movie document

# Constants
TMDB_API_KEY = settings.TMDB_API_KEY
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMG_BASE_URL = "https://image.tmdb.org/t/p/" # Base URL for images
POSTER_SIZE = "w500" # Example poster size
BACKDROP_SIZE = "w1280" # Example backdrop size
LINKS_CSV_PATH = os.path.join(project_root, 'data', 'ml-latest-small', 'links.csv')
REQUEST_DELAY = 0.25 # Seconds between TMDB API calls (respect rate limits)

# --- Helper Function ---
def get_tmdb_id_map(csv_path: str) -> dict[int, str]:
    """Reads links.csv and creates a mapping from movieId to tmdbId."""
    mapping = {}
    print(f"Reading TMDB ID mappings from: {csv_path}")
    try:
        with open(csv_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    if row['tmdbId']: # Only map if tmdbId exists
                        mapping[int(row['movieId'])] = row['tmdbId']
                except (ValueError, KeyError):
                    continue # Skip rows with bad formatting or missing keys
        print(f"Loaded {len(mapping)} movieId -> tmdbId mappings.")
        return mapping
    except FileNotFoundError:
        print(f"ERROR: links.csv not found at {csv_path}")
        return {}
    except Exception as e:
        print(f"Error reading links.csv: {e}")
        return {}

# --- Main Enrichment Logic ---
async def enrich_data():
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_DEFAULT":
        print("ERROR: TMDB_API_KEY is not configured in your .env file or config.py.")
        print("Please get an API key from themoviedb.org and set the VITE_TMDB_API_KEY environment variable.")
        return

    print("Starting movie data enrichment process...")
    client = AsyncIOMotorClient(settings.MONGODB_CONNECTION_STRING)
    db_instance = client[settings.DATABASE_NAME]
    await init_beanie(database=db_instance, document_models=[Movie])
    print("Beanie initialized.")

    # Load movieId -> tmdbId map
    id_map = get_tmdb_id_map(LINKS_CSV_PATH)
    if not id_map:
        print("Cannot proceed without TMDB ID mappings.")
        client.close()
        return

    # Find movies potentially missing details (e.g., description)
    # Adjust filter as needed, or process all if running for the first time
    movies_to_process = await Movie.find(Movie.description == None).to_list()
    # Alternatively, process all: movies_to_process = await Movie.find_all().to_list()
    print(f"Found {len(movies_to_process)} movies to potentially enrich.")

    if not movies_to_process:
        print("No movies found needing enrichment based on current filter.")
        client.close()
        return

    session = requests.Session() # Use a session for potentially better performance
    session.params = {'api_key': TMDB_API_KEY, 'language': 'en-US'} # Set API key for all requests

    updated_count = 0
    failed_count = 0

    print("Fetching details from TMDB and updating database (this may take a while)...")
    for movie in tqdm(movies_to_process, desc="Enriching movies"):
        tmdb_id = id_map.get(movie.movie_id)
        if not tmdb_id:
            # print(f"Skipping movie_id {movie.movie_id}: No TMDB ID found in links.csv")
            continue

        # --- Rate Limiting ---
        time.sleep(REQUEST_DELAY) # Wait between requests

        try:
            # Fetch details from TMDB API
            url = f"{TMDB_BASE_URL}/movie/{tmdb_id}"
            response = session.get(url)
            response.raise_for_status() # Raise HTTPError for bad responses (4XX, 5XX)
            details = response.json()

            # --- Extract data ---
            update_data = {}
            if details.get('overview'):
                update_data[Movie.description] = details['overview']
            if details.get('vote_average'):
                # TMDB rating is out of 10
                update_data[Movie.rating] = round(details['vote_average'], 1)
            if details.get('runtime'):
                update_data[Movie.duration] = details['runtime']
            if details.get('original_language'):
                 # TMDB uses language codes (e.g., "en"), map if needed or store directly
                 update_data[Movie.language] = details['original_language']
            if details.get('poster_path'):
                update_data[Movie.posterUrl] = f"{TMDB_IMG_BASE_URL}{POSTER_SIZE}{details['poster_path']}"
            if details.get('backdrop_path'):
                update_data[Movie.backdropUrl] = f"{TMDB_IMG_BASE_URL}{BACKDROP_SIZE}{details['backdrop_path']}"

            # Could also fetch /credits for director/cast
            # Could also fetch /watch/providers for streaming info (more complex parsing)

            # Update MongoDB document if we got new data
            if update_data:
                await Movie.find_one(Movie.id == movie.id).update(
                    {"$set": update_data}
                )
                updated_count += 1

        except requests.exceptions.RequestException as e:
            print(f"\nAPI Request failed for movie_id {movie.movie_id} (TMDB ID: {tmdb_id}): {e}")
            failed_count += 1
        except Exception as e:
            print(f"\nError processing movie_id {movie.movie_id} (TMDB ID: {tmdb_id}): {e}")
            failed_count += 1

    print("\n------------------------------------")
    print("Data enrichment complete.")
    print(f"Successfully fetched details and updated {updated_count} movies.")
    if failed_count > 0:
        print(f"Failed to fetch or process details for {failed_count} movies.")
    print("------------------------------------")

    client.close()
    print("MongoDB connection closed.")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(enrich_data())
# FlickAI Backend

## Overview
FlickAI Backend is a FastAPI-based server for a movie recommendation system. It handles user authentication, movie data management, and AI-driven personalized recommendations using sentence embeddings. The backend integrates with MongoDB for data storage and supports features like user registration, login, and favorite movie management.

## Key Features
- User authentication with JWT tokens
- API endpoints for user management and movie recommendations
- AI-driven recommendations based on user preferences (mood, genres, etc.)
- MongoDB integration for data persistence

## Installation

### Prerequisites
- Python 3.8 or higher
- MongoDB installed and running (locally or via a cloud service)

### Steps
1. Clone the repository:
   ```
   git clone <repository-url>
   cd flickai-backend
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables in a `.env` file:
   ```
   MONGODB_CONNECTION_STRING=mongodb://localhost:27017
   DATABASE_NAME=movie_db
   SECRET_KEY=your_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   ```
4. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

## Usage
- Access the API at `http://localhost:8000/api/v1`
- Key endpoints:
  - `/api/v1/auth/register`: Register a new user
  - `/api/v1/auth/token`: Login for access token
  - `/api/v1/recommendations`: Get movie recommendations
- Ensure MongoDB is running for data operations

## Additional Scripts
- Run `python scripts/generate_embeddings.py` to generate sentence embeddings for movie descriptions, enhancing recommendation accuracy

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
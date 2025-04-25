const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const app = express();
const port = 3001;

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/flickai'; // Update if using MongoDB Atlas

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Recommendation endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    console.log('Received preferences:', req.body); // Debug log
    const preferences = req.body;

    // Build query
    let query = {};

    if (preferences.genres && preferences.genres.length > 0) {
      query.genres = { $in: preferences.genres };
    }

    if (preferences.language) {
      query.language = preferences.language;
    }

    if (preferences.duration) {
      query.duration = { $lte: preferences.duration };
    }

    if (preferences.preferences && preferences.preferences.length > 0) {
      const orConditions = [];
      if (preferences.preferences.includes('trending')) {
        orConditions.push({ isTrending: true });
      }
      if (preferences.preferences.includes('classic')) {
        orConditions.push({ isClassic: true });
      }
      if (preferences.preferences.includes('hidden_gems')) {
        orConditions.push({ isHiddenGem: true });
      }
      if (orConditions.length > 0) {
        query.$or = orConditions;
      }
    }

    console.log('Query:', query); // Debug log
    // Fetch movies from database
    const movies = await Movie.find(query);
    console.log('Movies found:', movies.length); // Debug log

    // If no movies match, return all movies
    if (movies.length === 0) {
      const allMovies = await Movie.find({});
      console.log('Returning all movies:', allMovies.length); // Debug log
      return res.json(allMovies);
    }

    res.json(movies);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  posterUrl: { type: String, required: true },
  backdropUrl: { type: String, required: true },
  rating: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  genres: { type: [String], required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  streamingOn: { type: [String], default: [] },
  isClassic: { type: Boolean, default: false },
  isHiddenGem: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
});

module.exports = mongoose.model('Movie', movieSchema);
// src/types/movie.ts

export interface Movie {
  id: string; // Represents MongoDB _id (ObjectId serialized as string)
  movie_id: number; // Your custom numeric ID, migrated from the JSON 'id'
  title: string;
  year: number;
  posterUrl: string | null; // Updated to reflect optional fields in backend model
  backdropUrl: string | null;
  rating: number | null;
  duration: number | null;
  genres: string[];
  description: string | null;
  language: string | null;
  streamingOn?: string[] | null; // Optional fields
  isClassic?: boolean | null;
  isHiddenGem?: boolean | null;
  isTrending?: boolean | null;
}

export interface UserPreferences {
  mood: string;
  watchingWith: string;
  ageRange: string;
  genres: string[];
  language: string;
  duration: number;
  preferences: ('trending' | 'classic' | 'hidden_gems')[];
}

// RecommendationSte
// 
// p type (if used, ensure it's relevant)
export type RecommendationStep =
  | 'mood'
  | 'watching_with'
  | 'age_range'
  | 'genres'
  | 'language'
  | 'duration'
  | 'preferences';
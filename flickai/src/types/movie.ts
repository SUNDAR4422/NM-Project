export interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  duration: number; // in minutes
  genres: string[];
  description: string;
  language: string;
  streamingOn?: string[];
  isClassic?: boolean;
  isHiddenGem?: boolean;
  isTrending?: boolean;
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

export type RecommendationStep = 
  | 'mood'
  | 'watching_with'
  | 'age_range'
  | 'genres'
  | 'language'
  | 'duration'
  | 'preferences';

import { Movie, UserPreferences } from "../types/movie";
import { toast } from "@/components/ui/use-toast";

export const moods = [
  { value: "happy", label: "Happy", icon: "🥳" },
  { value: "sad", label: "Sad", icon: "😢" },
  { value: "excited", label: "Excited", icon: "😃" },
  { value: "relaxed", label: "Relaxed", icon: "😌" },
  { value: "romantic", label: "Romantic", icon: "😍" },
  { value: "bored", label: "Bored", icon: "😑" },
];

export const watchingWith = [
  { value: "alone", label: "Alone", icon: "👤" },
  { value: "friends", label: "Friends", icon: "👯" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "partner", label: "Partner", icon: "💑" },
  { value: "children", label: "Children", icon: "🧒" },
];

export const ageRanges = [
  { value: "all", label: "All Ages" },
  { value: "children", label: "Children (0-12)" },
  { value: "teen", label: "Teenagers (13-17)" },
  { value: "adult", label: "Adults (18+)" },
];

export const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Fantasy", "Historical", "Horror", "Mystery", "Romance",
  "Science Fiction", "Thriller", "Western", "Family"
];

export const languages = [
  "English", "Tamil", "French", "German", "Italian", 
  "Japanese", "Korean", "Chinese", "Hindi", "Russian"
];

export const durationOptions = [
  { value: 90, label: "< 90 min" },
  { value: 120, label: "< 2 hours" },
  { value: 150, label: "< 2.5 hours" },
  { value: 999, label: "Any length" },
];

export const preferencesOptions = [
  { value: "trending", label: "Trending Now", icon: "🔥" },
  { value: "classic", label: "Classics", icon: "🏆" },
  { value: "hidden_gems", label: "Hidden Gems", icon: "💎" },
];

// Use environment variable for API base URL (optional for development)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getMovieRecommendations = async (preferences: UserPreferences): Promise<Movie[]> => {
  try {
    console.log('Sending preferences:', preferences);
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recommendations: ${response.status} ${errorText}`);
    }

    const movies = await response.json();
    console.log('Received movies:', movies);
    return movies;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    toast({
      title: "Error",
      description: "Failed to load movie recommendations. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};
// src/data/mockData.ts
import { Movie, UserPreferences } from "../types/movie"; // Assuming these types are correct
import { toast } from "@/components/ui/use-toast";    // Assuming use-toast is from your components

// Your existing mock data (moods, watchingWith, etc.) should remain here
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
  "English", "Tamil", "Hindi"
];

export const durationOptions = [
  { value: 90, label: "< 90 min" },
  { value: 120, label: "< 2 hours" },
  { value: 150, label: "< 2.5 hours" },
  { value: 999, label: "Any length" }, // 999 for any length as used in backend
];

export const preferencesOptions = [
  { value: "trending", label: "Trending Now", icon: "🔥" },
  { value: "classic", label: "Classics", icon: "🏆" },
  { value: "hidden_gems", label: "Hidden Gems", icon: "💎" },
];

// Use environment variable for API base URL
// VITE_API_BASE_URL should be set in your frontend's .env.local file
// e.g., VITE_API_BASE_URL=http://127.0.0.1:8000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; // Default for same-origin deployment

export const getMovieRecommendations = async (preferences: UserPreferences): Promise<Movie[]> => {
  try {
    console.log('Sending preferences to backend:', preferences);
    const fullApiUrl = `${API_BASE_URL}/recommendations`;
    console.log('Requesting URL:', fullApiUrl);

    const response = await fetch(fullApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from backend: ${response.status}`, errorText);
      throw new Error(`Failed to fetch recommendations: ${response.status} ${errorText}`);
    }

    // The backend returns an object like { "movies": [...] }
    // We need to extract the 'movies' array.
    const responseData = await response.json(); 
    console.log('Received data from backend:', responseData);

    if (responseData && Array.isArray(responseData.movies)) {
      return responseData.movies as Movie[]; // Cast to Movie[] for type safety
    } else {
      console.error("Backend response did not contain a 'movies' array:", responseData);
      toast({ // Use your toast component for user feedback
        title: "Response Error",
        description: "Received an unexpected format from the server.",
        variant: "destructive",
      });
      return []; // Return an empty array or throw an error, depending on desired behavior
    }

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    let errorMessage = "Failed to load movie recommendations. Please try again.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    toast({
      title: "Network Error",
      description: errorMessage,
      variant: "destructive",
    });
    return []; // Return empty array on error
  }
};
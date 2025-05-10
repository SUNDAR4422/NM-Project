// src/data/userApi.ts
import { UserPublic } from '../context/AuthContext'; // Use UserPublic type from context

// Base URL from environment variable (should be http://127.0.0.1:8000/api/v1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("Error: VITE_API_BASE_URL environment variable is not set!");
}

const USERS_API_URL = `${API_BASE_URL}/users`; // Base for user endpoints

// Helper function for authenticated fetch
const fetchWithAuth = async (url: string, method: string, token: string, body?: any) => {
    const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
    };
    const options: RequestInit = {
        method: method,
        headers: headers,
    };
    if (body && method !== 'GET') {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        let errorDetail = `API call failed: ${response.status}`;
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch (e) { /* Ignore parsing error */ }
        throw new Error(errorDetail);
      }

    // For DELETE requests or others that might not return content
    if (response.status === 204) {
        return null; // Indicate success with no content
    }

    return await response.json();
};


// Get User's Favorite Movie IDs
export const getUserFavoritesApi = async (token: string): Promise<number[]> => {
  console.log("API Call: Getting user favorites");
  const responseData = await fetchWithAuth(`${USERS_API_URL}/me/favorites`, 'GET', token);
  // Assuming the backend returns the list directly
  return Array.isArray(responseData) ? responseData : [];
};

// Add a Movie to Favorites
// Returns the updated UserPublic object from the backend
export const addFavoriteApi = async (token: string, movieId: number): Promise<UserPublic> => {
    console.log(`API Call: Adding favorite movie ${movieId}`);
    // POST request, no body needed as ID is in URL
    return await fetchWithAuth(`${USERS_API_URL}/me/favorites/${movieId}`, 'POST', token);
};

// Remove a Movie from Favorites
// Returns the updated UserPublic object from the backend
export const removeFavoriteApi = async (token: string, movieId: number): Promise<UserPublic> => {
    console.log(`API Call: Removing favorite movie ${movieId}`);
    // DELETE request
    return await fetchWithAuth(`${USERS_API_URL}/me/favorites/${movieId}`, 'DELETE', token);
};
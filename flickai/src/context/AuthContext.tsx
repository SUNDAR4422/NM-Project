import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { loginUserApi, registerUserApi, getCurrentUserApi } from '../data/authApi';
// --- Import User API functions ---
import { getUserFavoritesApi, addFavoriteApi, removeFavoriteApi } from '../data/userApi';
// ---
import { LoginCredentials, RegisterData } from '../types/auth';

// User type (can be defined here or imported from types/user.ts)
export interface UserPublic {
  id?: string;
  email?: string;
  full_name?: string | null;
  is_active?: boolean;
  favorite_movie_ids?: number[]; // Add favorites here if backend sends it on /users/me
}

interface AuthContextType {
  user: UserPublic | null;
  token: string | null;
  favorites: number[]; // <-- New state for favorite movie IDs
  isAuthenticated: boolean;
  isLoading: boolean; // Overall auth loading state
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  // --- New functions for favorites ---
  addFavoriteMovie: (movieId: number) => Promise<boolean>;
  removeFavoriteMovie: (movieId: number) => Promise<boolean>;
  isFavorite: (movieId: number) => boolean;
  // ---
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [favorites, setFavorites] = useState<number[]>([]); // <-- Initialize favorites state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Centralized function to fetch user AND favorites data
  const fetchUserData = useCallback(async (currentToken: string) => {
      setIsLoading(true);
      try {
          console.log("AuthContext: Fetching current user...");
          const currentUser = await getCurrentUserApi(currentToken);
          if (currentUser) {
              setUser(currentUser);
              console.log("AuthContext: User fetched, fetching favorites...");
              // Fetch favorites IF user was fetched successfully
              try {
                  const favIds = await getUserFavoritesApi(currentToken);
                  setFavorites(favIds);
                  console.log("AuthContext: Favorites fetched:", favIds);
              } catch (favError) {
                  console.error("AuthContext: Error fetching favorites:", favError);
                  setFavorites([]); // Reset favorites on error
              }
          } else {
              handleLogout(); // Token invalid or user fetch failed
          }
      } catch (error) {
          console.error("AuthContext: Error validating token/fetching user:", error);
          handleLogout();
      } finally {
          setIsLoading(false);
      }
  }, []); // useCallback dependencies are empty as handleLogout doesn't change

  // Effect to run fetchUserData on initial load or token change
  useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
      setUser(null);
      setFavorites([]); // Clear favorites if no token
      setIsLoading(false); // No token, not loading
    }
  }, [token, fetchUserData]); // Run when token changes or fetchUserData reference changes (it doesn't)


  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true); // Indicate loading started
    try {
      const data = await loginUserApi(credentials);
      if (data && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        setToken(data.access_token); // This triggers the useEffect above
        // User and favorites will be fetched by the useEffect
        console.log("AuthContext: Login successful, token set.");
        return true;
      }
      setIsLoading(false); // Only set loading false here if login failed before setting token
      return false;
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      handleLogout(); // Clear any state
      setIsLoading(false);
      throw error; // Re-throw error so LoginPage can display it
    }
    // Note: setIsLoading(false) is primarily handled by the useEffect completing
  };

  const handleRegister = async (data: RegisterData): Promise<boolean> => {
      setIsLoading(true); // Consider separate loading state for register?
      try {
          const createdUser = await registerUserApi(data);
          if (createdUser) {
              console.log("AuthContext: Registration successful", createdUser);
              setIsLoading(false);
              return true; // Indicate success to RegisterPage
          }
          setIsLoading(false);
          return false;
      } catch (error) {
          console.error("AuthContext: Registration failed:", error);
          setIsLoading(false);
          throw error; // Re-throw error so RegisterPage can display it
      }
  };

  const handleLogout = () => {
    console.log("AuthContext: Logging out.");
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setFavorites([]); // Clear favorites on logout
  };

  // Function not really needed if useEffect handles it, but keep for potential manual refresh
  const fetchCurrentUser = async () => {
     if (token && !user) {
       await fetchUserData(token);
     }
  }

  // --- Favorite Management Functions ---
  const addFavoriteMovie = async (movieId: number): Promise<boolean> => {
      if (!token) {
          console.error("Cannot add favorite: No auth token found.");
          return false;
      }
      try {
          console.log(`AuthContext: Attempting to add favorite ${movieId}`);
          // API returns updated user, but we only need success indication maybe
          await addFavoriteApi(token, movieId);
          // Update local state optimistically or re-fetch
          setFavorites(prev => [...new Set([...prev, movieId])]); // Add locally using Set for uniqueness
          console.log(`AuthContext: Added favorite ${movieId} locally`);
          return true;
      } catch (error) {
          console.error(`AuthContext: Failed to add favorite ${movieId}:`, error);
          return false;
      }
  };

  const removeFavoriteMovie = async (movieId: number): Promise<boolean> => {
      if (!token) {
           console.error("Cannot remove favorite: No auth token found.");
           return false;
      }
      try {
          console.log(`AuthContext: Attempting to remove favorite ${movieId}`);
          await removeFavoriteApi(token, movieId);
          // Update local state
          setFavorites(prev => prev.filter(id => id !== movieId));
          console.log(`AuthContext: Removed favorite ${movieId} locally`);
          return true;
      } catch (error) {
          console.error(`AuthContext: Failed to remove favorite ${movieId}:`, error);
          return false;
      }
  };

  // Helper to check if a movie is already a favorite
  const isFavorite = (movieId: number): boolean => {
      return favorites.includes(movieId);
  };
  // --- End Favorite Management ---


  const contextValue: AuthContextType = {
    user,
    token,
    favorites, // Expose favorites
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchCurrentUser,
    addFavoriteMovie, // Expose add function
    removeFavoriteMovie, // Expose remove function
    isFavorite // Expose check function
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// src/data/authApi.ts
import { LoginCredentials, RegisterData, TokenResponse } from '../types/auth';
import { UserPublic } from '../context/AuthContext'; // Use UserPublic type from context

// Base URL from environment variable (should be set to http://127.0.0.1:8000/api/v1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("Error: VITE_API_BASE_URL environment variable is not set!");
    // Handle this case appropriately, maybe throw an error or use a default
}

// --- CORRECTED URL Construction ---
// Define endpoint paths relative to the base URL
const TOKEN_ENDPOINT = `${API_BASE_URL}/auth/token`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;
const USERS_ME_ENDPOINT = `${API_BASE_URL}/users/me`;
// ---

// Login User
export const loginUserApi = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  console.log("Attempting login to:", TOKEN_ENDPOINT); // Log actual URL
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Login failed with status: ${response.status}`;
    try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail;
    } catch (e) { /* Ignore parsing error */ }
    throw new Error(errorDetail);
  }
  return await response.json() as TokenResponse;
};

// Register User
export const registerUserApi = async (data: RegisterData): Promise<UserPublic> => {
  console.log("Attempting registration to:", REGISTER_ENDPOINT); // Log actual URL
  const response = await fetch(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
     let errorDetail = `Registration failed with status: ${response.status}`;
     try {
         const errorData = await response.json();
         errorDetail = errorData.detail || errorDetail;
     } catch (e) { /* Ignore parsing error */ }
     throw new Error(errorDetail);
  }
  return await response.json() as UserPublic;
};

// Get Current User (Protected Route)
export const getCurrentUserApi = async (token: string): Promise<UserPublic | null> => {
   console.log("Attempting to fetch current user from:", USERS_ME_ENDPOINT); // Log actual URL
   const response = await fetch(USERS_ME_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
        console.warn("Token validation failed (401)");
        return null;
    }
    throw new Error(`Failed to fetch current user: ${response.status}`);
  }
  return await response.json() as UserPublic;
};
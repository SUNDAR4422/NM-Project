// src/types/auth.ts

// For sending login credentials
export interface LoginCredentials {
  email: string; // Corresponds to 'username' in OAuth2PasswordRequestForm
  password: string;
}

// For sending registration data
export interface RegisterData {
  email: string;
  password: string;
  full_name?: string | null; // Optional name field
}

// For the response from the /token endpoint
export interface TokenResponse {
    access_token: string;
    token_type: string;
}
export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  code: number;
  message: string;
  data: {
    id: string;
    email: string;
    accessToken: string;
  };
  timestamp: string;
}

export interface AuthData {
  id: string;
  email: string;
  accessToken: string;
}
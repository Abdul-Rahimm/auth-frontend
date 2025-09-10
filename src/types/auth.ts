export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
}

export interface UpdateProfileData {
  email?: string;
  password?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

import axios, { AxiosError } from "axios";
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  ApiError,
  UpdateProfileData,
} from "@/types/auth";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/logout");
    return response.data;
  },

  updateProfile: async (
    userId: number,
    updateData: UpdateProfileData
  ): Promise<AuthResponse> => {
    const response = await api.patch<AuthResponse>(
      `/auth/update/${userId}`,
      updateData
    );
    return response.data;
  },
};

export default api;

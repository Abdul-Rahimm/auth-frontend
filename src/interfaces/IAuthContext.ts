import { User } from "@/types/auth";

export interface JwtPayload {
  sub: number;
  email: string;
  createdAt: string;
  iat?: number;
  exp?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshUserFromToken: () => void;
}

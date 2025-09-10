"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/auth";

import { AuthContextType, JwtPayload } from "@/interfaces/IAuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Check if token is expired (with 5 minute buffer)
    const currentTime = Date.now();
    const expirationTime = decoded.exp ? decoded.exp * 1000 : 0;
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    return expirationTime > currentTime + bufferTime;
  } catch {
    return false;
  }
};

const decodeTokenToUser = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check if token is expired
    if (!isTokenValid(token)) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      createdAt: decoded.createdAt,
    };
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const refreshUserFromToken = () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && isTokenValid(storedToken)) {
      const decodedUser = decodeTokenToUser(storedToken);
      if (decodedUser) {
        setUser(decodedUser);
        setToken(storedToken);
      } else {
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
      }
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    refreshUserFromToken();
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    const decodedUser = decodeTokenToUser(newToken);
    if (decodedUser) {
      localStorage.setItem("authToken", newToken);
      setUser(decodedUser);
      setToken(newToken);
    } else {
      console.error("Invalid token provided to login function");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    token,
    login,
    logout,
    refreshUserFromToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

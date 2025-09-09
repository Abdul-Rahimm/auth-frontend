"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // In a real app, you'd decode the JWT to get user info
      // For now, we'll just mark as authenticated
      setUser({
        id: 1,
        email: "user@example.com",
        createdAt: new Date().toISOString(),
      });
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    // In a real app, you'd decode the JWT to get user info
    setUser({
      id: 1,
      email: "user@example.com",
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
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

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { saveCadetProfile } from "@/lib/cadetProfile";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  grade?: string | null;
  school?: string | null;
  age?: number | null;
  avatar_id?: string | null;
  avatar_image?: string | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  grade?: string;
  school?: string;
  age?: number;
  avatar_id?: string;
  avatar_image?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const TOKEN_KEY = "safezone_access_token";
const USER_KEY = "safezone_user_data";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncCadetProfile = useCallback((userData: AuthUser) => {
    try {
      saveCadetProfile({
        name: userData.full_name,
        age: userData.age ?? 15,
        grade: userData.grade || "Grade 10",
        school: userData.school || "National Safety Academy",
        avatarId: userData.avatar_id || "shield",
        avatarImage: userData.avatar_image || undefined,
      });
    } catch (e) {
      console.warn("Failed to sync cadet profile:", e);
    }
  }, []);

  const fetchMe = useCallback(async (authToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        const userData: AuthUser = await res.json();
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        syncCadetProfile(userData);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.warn("Could not connect to auth/me endpoint, using cached state if available", err);
    }
  }, [syncCadetProfile]);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUserStr = localStorage.getItem(USER_KEY);
    
    if (savedToken) {
      setToken(savedToken);
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          syncCadetProfile(parsed);
        } catch {
          // ignore parsing error
        }
      }
      fetchMe(savedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe, syncCadetProfile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.msg || "Login failed. Please check your credentials.");
      }

      const accessToken = data.access_token;
      const userPayload: AuthUser = data.user || {
        id: "usr-" + Date.now(),
        email,
        full_name: email.split("@")[0] || "Cadet",
        role: "STUDENT",
      };

      setToken(accessToken);
      setUser(userPayload);
      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userPayload));

      if (accessToken) {
        fetchMe(accessToken);
      } else {
        syncCadetProfile(userPayload);
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred during login.");
      return false;
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          full_name: payload.full_name,
          role: payload.role || "STUDENT",
          grade: payload.grade || "Grade 10",
          school: payload.school || "SafeZone High",
          avatar_id: payload.avatar_id || "shield",
          avatar_image: payload.avatar_image || null,
          age: payload.age || 15,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.msg || "Registration failed.");
      }

      const loginSuccess = await login(payload.email, payload.password);
      return loginSuccess;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred during registration.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };


  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

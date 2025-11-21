import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      // Try to fetch user profile
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If there's an error fetching profile, clear auth tokens
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // First, login to get the token
      const response = await authApi.login(email, password);
      console.log("Login response:", response);
      
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        
        // Now fetch the user profile
        await fetchUserProfile();
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials",
      });
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // First, register to get the token
      const response = await authApi.register(username, email, password);
      console.log("Register response:", response);
      
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        
        // Now fetch the user profile
        await fetchUserProfile();
        
        toast({
          title: "Account created!",
          description: "Welcome to Markly!",
        });
      } else {
        throw new Error("Registration failed: No token received");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create account",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
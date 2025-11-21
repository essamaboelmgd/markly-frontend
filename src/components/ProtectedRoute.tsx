import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Log authentication status for debugging
  useEffect(() => {
    console.log("ProtectedRoute - Auth Status:", { 
      isAuthenticated, 
      isLoading, 
      user,
      pathname: location.pathname
    });
  }, [isAuthenticated, isLoading, user, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "admin" && user?.role !== "superadmin") {
    console.log("User not authorized for admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User authenticated, allowing access to protected route");
  return <>{children}</>;
}
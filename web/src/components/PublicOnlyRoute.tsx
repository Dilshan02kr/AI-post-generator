import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type PublicOnlyRouteProps = {
  children: ReactNode;
};

function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <p className="page-loading">Checking authentication...</p>;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicOnlyRoute;

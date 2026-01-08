import { Navigate } from "react-router-dom";
import type { UserRole } from "@/types/auth.types";
import { useAuth } from "@/hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

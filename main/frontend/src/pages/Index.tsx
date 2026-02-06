import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Landing from "./Landing";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/analyst");
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Show landing page for non-authenticated users
  return <Landing />;
};

export default Index;

import api from "./api";
import type { AuthResponse, UserRole } from "@/types/api";

// Local Authentication
export const localSignup = async (data: {
  email: string;
  password: string;
  role: UserRole;
}): Promise<AuthResponse> => {
  const res = await api.post("/auth/local/signup", data);
  return res.data;
};

export const localLogin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/auth/local/login", { email, password });
  return res.data;
};

// Google Authentication
export const googleSignup = async (
  idToken: string,
  role: UserRole
): Promise<AuthResponse> => {
  const res = await api.post("/auth/google/signup", { idToken, role });
  return res.data;
};

export const googleLogin = async (idToken: string): Promise<AuthResponse> => {
  const res = await api.post("/auth/google/login", { idToken });
  return res.data;
};

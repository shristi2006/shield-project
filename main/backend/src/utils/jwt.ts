import jwt, { JwtPayload as BaseJwtPayload } from "jsonwebtoken";
import { UserRole } from "../models/User";

export interface JwtPayload extends BaseJwtPayload {
  userId: string;
  role: UserRole;
}

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return process.env.JWT_SECRET;
};

export const signJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};

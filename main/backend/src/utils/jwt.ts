import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export const signJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
};

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthenticated',
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
};

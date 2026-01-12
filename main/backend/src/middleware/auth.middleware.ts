import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

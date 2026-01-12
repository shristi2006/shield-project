import { UserRole } from "../models/User";

declare global {
  namespace Express {
    interface User {
      id: string;       
      role: UserRole;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};

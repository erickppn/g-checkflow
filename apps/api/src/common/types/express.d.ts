import { UserRole } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
    }
  }
}

export {};
import type { User } from "./src/types";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      BASE_URL: string;
      ENV_PATH: string;
      SESSION_SECRET: string;
      COOKIE_SECRET: string;
    }
  }

  namespace Express {
    export interface Locals {
      sessionUser?: User;
      fetchUser?: Omit<User, "password">;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

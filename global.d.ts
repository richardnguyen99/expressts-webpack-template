declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      BASE_URL: string;
      ENV_PATH: string;
      SESSION_SECRET: string;
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

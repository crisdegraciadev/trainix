declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ENV: "dev" | "test" | "prod";
      NEXT_PUBLIC_API_ENDPOINT: string;
    }
  }
}

export {};

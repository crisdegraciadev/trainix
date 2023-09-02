declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: "dev" | "test" | "prod";
      NEXT_PUBLIC_API_ENDPOINT: string;
    }
  }
}

export {};

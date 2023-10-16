declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'test' | 'prod' | 'e2e';
      PORT: number;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      SALT_ROUNDS: number;
    }
  }
}

export {};

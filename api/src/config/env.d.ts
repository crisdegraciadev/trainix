declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'dev' | 'test' | 'prod';
    }
  }
}

export {};

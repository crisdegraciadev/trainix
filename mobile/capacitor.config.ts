import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trainix.app',
  appName: 'trainix',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

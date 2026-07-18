import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartsafari.kids',
  appName: 'Smart Safari Kids',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;

/* eslint-env node */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');
  console.log('Vite build env VITE_GOOGLE_CLIENT_ID =', env.VITE_GOOGLE_CLIENT_ID);
  console.log('Vite build env VITE_API_URL =', env.VITE_API_URL);

  return {
    base: './',
    plugins: [react()],
  };
});

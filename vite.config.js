import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173  // <-- change this to 3000 if you want, but use the same in browser
  }
});

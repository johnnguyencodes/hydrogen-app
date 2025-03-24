import {defineConfig} from 'vitest/config';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  test: {
    environment: 'jsdom', // Set the test environment to jsdom
    globals: true, // Enable global variables like 'describe', 'test', etc.
    env: {},

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/end-to-end-tests/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

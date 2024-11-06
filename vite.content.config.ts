import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: 'src/content-scripts/content.ts',
      },
      output: {
        entryFileNames: 'content-scripts/content.js',
      },
    },
  },
});

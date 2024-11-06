import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: 'src/background/service-worker.ts',
      },
      output: {
        entryFileNames: 'background/service-worker.js',
      },
    },
  },
});

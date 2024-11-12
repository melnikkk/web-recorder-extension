import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'service-worker': 'src/background/service-worker.ts',
      },
      output: { entryFileNames: 'background/[name].js' },
    },
  },
});

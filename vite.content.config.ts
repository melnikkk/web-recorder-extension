import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'content-script': 'src/entry-points/content/index.ts',
      },
      output: { entryFileNames: 'content/[name].js' },
    },
  },
});

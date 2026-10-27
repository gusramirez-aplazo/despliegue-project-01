import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  base: '/pendientes/',
  plugins: [ViteImageOptimizer({ jpg: { quality: 75 } })],
  build: {
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ names }) =>
          `${names[0].endsWith('.css') ? 'css' : 'img'}/[name]-[hash][extname]`,
      },
    },
  },
});

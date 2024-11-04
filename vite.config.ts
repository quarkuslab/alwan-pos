// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import { Plugin } from 'vite';

// Custom plugin to transform HTML output
function htmlRelativePathsPlugin(): Plugin {
  return {
    name: 'html-relative-paths',
    transformIndexHtml(html) {
      // Remove leading slashes from src and href attributes
      return html.replace(
        /(src|href)="\/(?!(http|https|ftp|data:))/g,
        '$1="'
      );
    }
  };
}

// Legacy browser targets
const legacyTargets = {
  ie: '11',
  chrome: '49',
  firefox: '52',
  safari: '9.1',
  edge: '13',
  ios: '9'
};

export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(process.env.API_URL)
  },
  plugins: [
    react(),
    legacy({
      targets: legacyTargets,
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true,
      renderLegacyChunks: true,
      polyfills: [
        'es.promise',
        'es.array.iterator',
        'es.object.assign',
        'es.symbol',
        'es.symbol.description',
        'es.symbol.iterator',
        'web.dom-collections.iterator'
      ]
    }),
    htmlRelativePathsPlugin()
  ],
  base: '',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // Let Vite determine the proper build target based on browserslist
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
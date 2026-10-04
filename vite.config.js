import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function inlineAssets() {
  return {
    name: 'inline-single-html-assets',
    apply: 'build',
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
      const htmlFile = Object.values(bundle).find((entry) =>
        entry.fileName.endsWith('.html')
      );
      if (!htmlFile) throw new Error(`Single-file build did not emit an HTML entry point (${Object.keys(bundle).join(', ')}).`);
      let html = String(htmlFile.source);
      const cssPath = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)?.[1];
      const jsPath = html.match(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/)?.[1];
      if (!cssPath || !jsPath) throw new Error('Unable to find built JavaScript or CSS assets to inline.');
      const cssName = cssPath.replace(/^\//, '');
      const jsName = jsPath.replace(/^\//, '');
      const css = bundle[cssName];
      const js = bundle[jsName];
      if (!css || css.type !== 'asset' || !js || js.type !== 'chunk') {
        throw new Error('Vite did not emit the expected CSS asset and JavaScript entry chunk.');
      }
      html = html.replace(/<link[^>]+href="[^"]+\.css"[^>]*>/, `<style>${String(css.source)}</style>`);
      const safeScript = js.code.replace(/<\/script/gi, '\\x3C/script');
      html = html.replace(
        /<script[^>]+src="[^"]+\.js"[^>]*><\/script>/,
        () => `<script type="module">${safeScript}</script>`
      );
      htmlFile.source = html;
      delete bundle[cssName];
      delete bundle[jsName];
      }
    }
  };
}

// Emits the shared offline service worker as `sw.js` for builds and the dev server.
function serviceWorker() {
  const source = () => readFileSync(resolve(import.meta.dirname, 'src/service-worker.js'), 'utf8');
  return {
    name: 'deck-service-worker',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: source() });
    },
    configureServer(server) {
      server.middlewares.use('/sw.js', (_request, response) => {
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        response.end(source());
      });
    }
  };
}

export default defineConfig({
  plugins: [tailwindcss(), inlineAssets(), serviceWorker()],
  root: process.cwd(),
  server: {
    fs: {
      allow: [resolve(import.meta.dirname), process.cwd()]
    }
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        inlineDynamicImports: true
      }
    }
  }
});

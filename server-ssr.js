/**
 * SSR-Enabled Production Server
 * Renders React app on the server for AI visibility and SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3006;

async function createServer() {
  const app = express();

  // Middleware
  app.use(express.json());

  let vite;
  if (!isProduction) {
    // Development mode: use Vite dev server with SSR
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files
    app.use(express.static(path.join(__dirname, 'dist/client'), { index: false }));
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), ssr: true });
  });

  // SSR handler for all routes
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template, render;

      if (!isProduction) {
        // Development: load template and render function via Vite
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        
        try {
          render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
        } catch (moduleError) {
          console.error('Failed to load SSR module:', moduleError.message);
          // Fall back to CSR
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        }
      } else {
        // Production: load pre-built template and render function
        template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      // Render the app HTML
      let appHtml = '';
      try {
        const renderResult = render(url);
        appHtml = renderResult.html || renderResult;
      } catch (renderError) {
        console.error('Render error:', renderError.message);
        // Fall back to CSR
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      }

      // Inject the app HTML into the template
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // Send the rendered HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      // If SSR fails, fall back to client-side rendering
      console.error('SSR Error:', error.message);
      console.error('Stack:', error.stack);
      
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(error);
      }

      // Send the template without SSR (fallback to CSR)
      try {
        let template;
        if (!isProduction) {
          template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
        } else {
          template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        }
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError.message);
        next(fallbackError);
      }
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ SSR Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🎨 SSR: ${isProduction ? 'Production' : 'Development'} mode`);
  });
}

createServer();

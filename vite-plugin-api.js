/**
 * Vite Plugin to handle Vercel serverless functions in development
 * This allows /api routes to work locally without running `vercel dev`
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function apiPlugin() {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only handle /api routes
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          // Convert URL to file path
          // e.g., /api/endoguard/assess -> api/endoguard/assess.js
          const apiPath = req.url.split('?')[0].substring(1); // Remove leading /
          const filePath = join(__dirname, `${apiPath}.js`);

          // Check if the file exists
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'API endpoint not found' }));
            return;
          }

          // Import the serverless function
          const module = await import(`file://${filePath}?t=${Date.now()}`);
          const handler = module.default;

          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Invalid API handler' }));
            return;
          }

          // Create a proper response object with Vercel-like methods
          const mockRes = {
            statusCode: 200,
            headers: {},
            status(code) {
              this.statusCode = code;
              return this; // Return this for method chaining
            },
            json(data) {
              res.statusCode = this.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return this;
            },
            send(data) {
              res.statusCode = this.statusCode;
              res.end(data);
              return this;
            },
            setHeader(key, value) {
              this.headers[key] = value;
              res.setHeader(key, value);
              return this;
            }
          };

          // Parse request body for POST requests
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                req.body = JSON.parse(body);
              } catch (e) {
                req.body = {};
              }

              // Call the handler with our mock response
              await handler(req, mockRes);
            });
          } else {
            // For GET, DELETE, etc.
            await handler(req, mockRes);
          }
        } catch (error) {
          console.error('API Error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ 
            error: 'Internal server error',
            message: error.message 
          }));
        }
      });
    }
  };
}

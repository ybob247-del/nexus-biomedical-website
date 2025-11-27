import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

/**
 * Server-side rendering entry point
 * Renders the React app to HTML string for SSR
 */
export function render(url, context = {}) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StaticRouter>
    </React.StrictMode>
  );
  
  return { html, context };
}

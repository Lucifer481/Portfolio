// Central API configuration
// In development, Vite's proxy handles /api → localhost:5000
// In production, we call the Render backend directly to avoid
// relying on _redirects proxy rewrites (which can fail and return
// HTML instead of JSON, causing "Unexpected end of JSON input")
export const API_BASE = import.meta.env.PROD
  ? 'https://portfolio-k0e8.onrender.com'
  : '';

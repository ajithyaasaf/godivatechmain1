import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import path from 'path';
import compression from 'compression';
import { registerRoutes } from "./routes";
import { staticAssetCache, apiCache, htmlCache } from "./caching";
import { seoMiddleware } from "./seo-middleware";

export async function createApp() {
  const app = express();

  // Trust proxy for secure cookies and IP detection on Vercel/proxies
  app.set("trust proxy", 1);

  // Enable gzip compression for all responses
  app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req: any, res: any) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  // Configure CORS for cross-origin requests
  const allowedOrigins = [
    'https://www.godivatech.com',
    'https://godivatech.com',
    'https://godivatech.vercel.app',
    'http://localhost:5000',
    'http://localhost:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:3000',
  ];

  if (process.env.ALLOWED_ORIGINS) {
    const custom = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    allowedOrigins.push(...custom);
  }

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('godivatech.com')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in production to prevent false-positive CORS drops
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Pragma']
  }));

  // Ensure CORS headers are always set for preflight & normal requests
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Cache-Control, Pragma');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.status(204).end();
      return;
    }
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  // Security Headers Middleware
  app.use((req, res, next) => {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://firestore.googleapis.com https://www.google-analytics.com https://*.vercel.app https://godivatech.com https://www.godivatech.com",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');

    res.header('Content-Security-Policy', csp);
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    next();
  });

  // Apply caching strategies based on request path
  app.use((req, res, next) => {
    const pathName = req.path;
    if (pathName.startsWith('/api/')) {
      apiCache(req, res, next);
    } else if (pathName.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map|webp)$/)) {
      staticAssetCache(req, res, next);
    } else {
      htmlCache(req, res, next);
    }
  });

  // Body parsing with 10MB limit for image uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  // SEO middleware
  app.use(seoMiddleware);

  // Serve attached_assets static folder if present
  const attachmentsDir = path.resolve(process.cwd(), 'attached_assets');
  app.use('/attached_assets', express.static(attachmentsDir, {
    fallthrough: false,
    immutable: true,
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400, immutable');
    },
  }));

  // Register all routes (auth, sitemaps, CRUD APIs, etc.)
  await registerRoutes(app);

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Express App Error:", err);
    res.status(status).json({ message });
  });

  return app;
}

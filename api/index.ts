import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { storage } from '../server/storage';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const app = express();

// CORS for Vercel
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Session configuration for serverless
const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Password helpers
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashedPassword, salt] = stored.split('.');
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Auth routes
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    });
  })(req, res, next);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const { password, ...userWithoutPassword } = req.user as any;
    return res.json(userWithoutPassword);
  }
  res.status(401).json({ message: 'Not authenticated' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;

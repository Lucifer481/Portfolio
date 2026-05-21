import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDbConnection, initDatabase } from './db.js';
import { sendContactEmail } from './email.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Trust the first proxy (Render) so X‑Forwarded‑For is respected by rate‑limit
app.set('trust proxy', 1);

// Explicit CORS config — allow the production frontend domain and localhost for dev
const corsOptions = {
  origin: [
    'https://www.sushanbhadel.com.np',
    'https://sushanbhadel.com.np',
    'http://localhost:5173',    // Vite dev server
    'http://localhost:4173',    // Vite preview
  ],
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enforce HTTPS when behind proxy (Render forwards X-Forwarded-Proto)
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Ensure JWT secret is defined
if (!process.env.JWT_SECRET) {
  console.error('[CONFIG] Missing JWT_SECRET environment variable. Exiting.');
  process.exit(1);
}

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Initialize database tables and seed defaults
initDatabase().catch(err => {
  console.error('[DB] Failed to initialize database:', err);
});

// Middleware for JWT authorization
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS
// ----------------------------------------------------

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const db = await getDbConnection();
    const projects = await db.all('SELECT * FROM projects');
    await db.close();

    // Map projects to format arrays
    const formattedProjects = projects.map(p => ({
      ...p,
      isGallery: !!p.isGallery,
      tech: JSON.parse(p.tech || '[]'),
      images: JSON.parse(p.images || '[]')
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error('[API] Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const db = await getDbConnection();
    const skills = await db.all('SELECT * FROM skills');
    await db.close();
    res.json(skills);
  } catch (error) {
    console.error('[API] Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// Get all experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const db = await getDbConnection();
    const experiences = await db.all('SELECT * FROM experiences ORDER BY id ASC');
    await db.close();
    res.json(experiences);
  } catch (error) {
    console.error('[API] Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences.' });
  }
});

// Rate limiter for contact submissions (5 per minute)
const contactLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Zod schema for contact validation
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(150),
  message: z.string().min(1).max(2000),
});

// Contact Form submission (apply limiter and validation)
app.post('/api/contact', contactLimiter, async (req, res) => {
  const validation = contactSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }
  const { name, email, subject, message } = validation.data;
  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });

  let db;
  try {
    db = await getDbConnection();
    const result = await db.run(
      `INSERT INTO messages (name, email, subject, message, date, status) 
       VALUES (?, ?, ?, ?, ?, 'unread')`,
      [name, email, subject, message, dateString]
    );

    const emailSent = await sendContactEmail({ name, email, subject, message, date: dateString });
    if (!emailSent) {
      console.error('[API] SMTP email not sent');
    }

    return res.status(201).json({
      success: true,
      message: 'Message saved and email sent.',
      id: result.lastID
    });
  } catch (error) {
    console.error('[API] Error saving contact message:', error);
    return res.status(500).json({ error: 'Failed to process contact request.' });
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error('[DB] Error closing database connection:', closeError);
      }
    }
  }
});

// ----------------------------------------------------
// ADMIN API ENDPOINTS
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const db = await getDbConnection();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    await db.close();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.error('[API] Login error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// Get inbox messages (Protected)
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
  try {
    const db = await getDbConnection();
    const messages = await db.all('SELECT * FROM messages ORDER BY id DESC');
    await db.close();
    res.json(messages);
  } catch (error) {
    console.error('[API] Error fetching inbox:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Update message status (read/unread) (Protected)
app.patch('/api/admin/messages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'read' or 'unread'

  if (!status || !['read', 'unread'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status update.' });
  }

  try {
    const db = await getDbConnection();
    await db.run('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
    await db.close();
    res.json({ success: true, message: 'Message updated.' });
  } catch (error) {
    console.error('[API] Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message.' });
  }
});

// Delete message (Protected)
app.delete('/api/admin/messages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDbConnection();
    await db.run('DELETE FROM messages WHERE id = ?', [id]);
    await db.close();
    res.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    console.error('[API] Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

// Generic error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] running on http://localhost:${PORT}`);
});

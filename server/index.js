import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

import { getDbConnection, initDatabase } from './db.js';
import { sendContactEmail } from './email.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

if (!process.env.JWT_SECRET) {
  console.error('[CONFIG] Missing JWT_SECRET');
  process.exit(1);
}

const corsOptions = {
  origin: [
    'https://www.sushanbhadel.com.np',
    'https://sushanbhadel.com.np',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
      });
    }

    req.user = user;

    next();
  });
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(150),
  message: z.string().min(1).max(2000),
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio Backend Running',
  });
});

app.get('/api/projects', async (req, res) => {
  try {
    const db = await getDbConnection();

    const projects = await db.all('SELECT * FROM projects');

    await db.close();

    const formattedProjects = projects.map((p) => ({
      ...p,
      isGallery: !!p.isGallery,
      tech: JSON.parse(p.tech || '[]'),
      images: JSON.parse(p.images || '[]'),
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch projects',
    });
  }
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const validation = contactSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Invalid input data',
    });
  }

  const { name, email, subject, message } = validation.data;

  const dateString = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
  });

  let db;

  try {
    db = await getDbConnection();

    const result = await db.run(
      `
      INSERT INTO messages (name, email, subject, message, date, status)
      VALUES (?, ?, ?, ?, ?, 'unread')
      `,
      [name, email, subject, message, dateString]
    );

    await sendContactEmail({
      name,
      email,
      subject,
      message,
      date: dateString,
    });

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      id: result.lastID,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to process request',
    });
  } finally {
    if (db) {
      await db.close();
    }
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password required',
    });
  }

  try {
    const db = await getDbConnection();

    const user = await db.get(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    await db.close();

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Authentication failed',
    });
  }
});

app.get('/api/admin/messages', authenticateToken, async (req, res) => {
  try {
    const db = await getDbConnection();

    const messages = await db.all(
      'SELECT * FROM messages ORDER BY id DESC'
    );

    await db.close();

    res.json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch messages',
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal server error',
  });
});

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Server] Startup failed:', error);
    process.exit(1);
  }
}

startServer();

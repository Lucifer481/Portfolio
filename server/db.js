import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

export async function getDbConnection() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function initDatabase() {
  const db = await getDbConnection();

  await db.exec('PRAGMA foreign_keys = ON');

  // USERS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // MESSAGES
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'unread'
    )
  `);

  // PROJECTS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      tech TEXT NOT NULL,
      link TEXT,
      isGallery INTEGER DEFAULT 0,
      images TEXT
    )
  `);

  // SKILLS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      desc TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      glow TEXT NOT NULL
    )
  `);

  // EXPERIENCES
  await db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL
    )
  `);

  console.log('[DB] Tables initialized');

  // DEFAULT ADMIN
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  const existingUser = await db.get(
    'SELECT * FROM users WHERE username = ?',
    [adminUser]
  );

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(adminPass, 10);

    await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [adminUser, hashedPassword]
    );

    console.log('[DB] Default admin created');
  }

  await db.close();
}

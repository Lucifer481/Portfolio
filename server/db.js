import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use the connection string provided by Render or other services
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function getDbConnection() {
  return await pool.connect();
}

export async function initDatabase() {
  const client = await getDbConnection();
  try {
    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // Create Messages table (contact inbox)
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'unread'
      )
    `);

    // Create Projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        tech TEXT NOT NULL, -- Stored as stringified JSON array
        link TEXT,
        isGallery INTEGER DEFAULT 0,
        images TEXT -- Stored as stringified JSON array
      )
    `);

    // Create Skills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        "desc" TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        glow TEXT NOT NULL
      )
    `);

    // Create Experience table
    await client.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        year TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL
      )
    `);

    console.log('[DB] Tables initialized successfully.');

    // Seed default admin user if not exists
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const userRes = await client.query('SELECT * FROM users WHERE username = $1', [adminUser]);
    if (userRes.rowCount === 0) {
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [adminUser, hashedPassword]);
      console.log(`[DB] Default admin user "${adminUser}" created.`);
    }

    // Seed default projects if empty
    const projectCountRes = await client.query('SELECT COUNT(*) as count FROM projects');
    if (parseInt(projectCountRes.rows[0].count) === 0) {
      const defaultProjects = [
        {
          title: 'Animated Sunburst Web',
          category: 'Web Dev',
          image: '/projects/project1.png',
          tech: JSON.stringify(['React', 'Web Design']),
          link: 'https://animated-sunburst-61a20d.netlify.app/',
          isGallery: 0,
          images: JSON.stringify([])
        },
        {
          title: 'Luxury Stroopwafel',
          category: 'Web Dev',
          image: '/projects/project2.png',
          tech: JSON.stringify(['Frontend', 'UI/UX']),
          link: 'https://luxury-stroopwafel-0ea598.netlify.app/',
          isGallery: 0,
          images: JSON.stringify([])
        },
        {
          title: 'LiveWebForTFC',
          category: 'Web Dev',
          image: '/projects/project3.png',
          tech: JSON.stringify(['Web Dev', 'Design']),
          link: 'https://livewebfortfc.netlify.app/',
          isGallery: 0,
          images: JSON.stringify([])
        },
        {
          title: 'Meek Cendol',
          category: 'Web Dev',
          image: '/projects/project4.png',
          tech: JSON.stringify(['HTML/CSS', 'JS']),
          link: 'https://meek-cendol-37479c.netlify.app/',
          isGallery: 0,
          images: JSON.stringify([])
        },
        {
          title: 'Robo-Wolf Esports Mascot Logo',
          category: 'Design',
          image: '/projects/logo.png',
          tech: JSON.stringify(['Logo Design', 'Vector Illustrator', 'Branding']),
          link: '',
          isGallery: 1,
          images: JSON.stringify([
            '/projects/logo.png',
            '/projects/thumbnail.png',
            '/projects/poster.png',
            '/projects/banner.png',
            '/projects/gfx.png',
          ])
        },
        {
          title: 'Gaming Aimbot YouTube Thumbnail',
          category: 'Design',
          image: '/projects/thumbnail.png',
          tech: JSON.stringify(['YouTube Thumbnail', 'Photoshop', 'Esports']),
          link: '',
          isGallery: 1,
          images: JSON.stringify([
            '/projects/thumbnail.png',
            '/projects/logo.png',
            '/projects/poster.png',
            '/projects/banner.png',
            '/projects/gfx.png',
          ])
        },
        {
          title: 'Cyber Defense Hackathon Poster',
          category: 'Design',
          image: '/projects/poster.png',
          tech: JSON.stringify(['Poster Design', 'Social Media', 'CyberSec']),
          link: '',
          isGallery: 1,
          images: JSON.stringify([
            '/projects/poster.png',
            '/projects/thumbnail.png',
            '/projects/logo.png',
            '/projects/banner.png',
            '/projects/gfx.png',
          ])
        },
        {
          title: 'Neon Cyberpunk Header Banner',
          category: 'Design',
          image: '/projects/banner.png',
          tech: JSON.stringify(['Banner Design', 'Twitter Header', 'GFX']),
          link: '',
          isGallery: 1,
          images: JSON.stringify([
            '/projects/banner.png',
            '/projects/thumbnail.png',
            '/projects/logo.png',
            '/projects/poster.png',
            '/projects/gfx.png',
          ])
        },
        {
          title: 'Synzx Creative Esports Headers',
          category: 'Design',
          image: '/projects/gfx.png',
          tech: JSON.stringify(['GFX Design', 'Banners', 'Vectors']),
          link: '',
          isGallery: 1,
          images: JSON.stringify([
            '/projects/gfx.png',
            '/projects/thumbnail.png',
            '/projects/logo.png',
            '/projects/poster.png',
            '/projects/banner.png',
          ])
        }
      ];

      for (const p of defaultProjects) {
        await client.query(
          `INSERT INTO projects (title, category, image, tech, link, isGallery, images) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [p.title, p.category, p.image, p.tech, p.link, p.isGallery, p.images]
        );
      }
      console.log('[DB] Default projects seeded.');
    }

    // Seed default skills if empty
    const skillCountRes = await client.query('SELECT COUNT(*) as count FROM skills');
    if (parseInt(skillCountRes.rows[0].count) === 0) {
      const defaultSkills = [
        { name: 'Full Stack Development', desc: 'Building highly secure and performant production-ready MERN/Next.js WebApps.', icon: 'Terminal', color: 'from-cyan-400 to-blue-500', glow: 'rgba(0, 255, 255, 0.3)' },
        { name: 'React.js', desc: 'Crafting responsive user interfaces with complex state & smooth animations.', icon: 'FaReact', color: 'from-blue-400 to-indigo-500', glow: 'rgba(59, 130, 246, 0.3)' },
        { name: 'JavaScript', desc: 'Deep scripting logic, asynchronous flows, and algorithmic challenges solver.', icon: 'FaJs', color: 'from-yellow-400 to-amber-500', glow: 'rgba(234, 179, 8, 0.3)' },
        { name: 'UI/UX Design', desc: 'Creating high-fidelity interactive wireframes, user journeys, and prototypes.', icon: 'Cpu', color: 'from-purple-400 to-pink-500', glow: 'rgba(168, 85, 247, 0.3)' },
        { name: 'Graphic Design', desc: 'Designing creative social media visuals, high-quality vectors, and banners.', icon: 'Palette', color: 'from-pink-500 to-rose-500', glow: 'rgba(244, 63, 94, 0.3)' },
        { name: 'Video Editing', desc: 'Assembling dynamic cinematic trailers, gaming montages, and content storytelling.', icon: 'Video', color: 'from-red-500 to-orange-500', glow: 'rgba(239, 68, 68, 0.3)' },
        { name: 'Ethical Hacking', desc: 'Active network scanning, penetration testing, and identifying security loopholes.', icon: 'ShieldAlert', color: 'from-green-400 to-emerald-500', glow: 'rgba(34, 197, 94, 0.3)' },
        { name: 'Cybersecurity', desc: 'Assessing system defense, secure coding patterns, and network architecture.', icon: 'Shield', color: 'from-teal-400 to-cyan-500', glow: 'rgba(20, 184, 166, 0.3)' },
        { name: 'Bug Bounty Hunting', desc: 'Independent vulnerability hunting and web penetration testing in free time.', icon: 'Target', color: 'from-emerald-400 to-teal-500', glow: 'rgba(16, 185, 129, 0.3)' }
      ];

      for (const s of defaultSkills) {
        await client.query(
          `INSERT INTO skills (name, "desc", icon, color, glow) VALUES ($1, $2, $3, $4, $5)`,
          [s.name, s.desc, s.icon, s.color, s.glow]
        );
      }
      console.log('[DB] Default skills seeded.');
    }

    // Seed default experience if empty
    const experienceCountRes = await client.query('SELECT COUNT(*) as count FROM experiences');
    if (parseInt(experienceCountRes.rows[0].count) === 0) {
      const defaultExperiences = [
        {
          year: '2023 - Present',
          role: 'Independent Bug Bounty Hunter',
          company: 'Self-Employed / Platforms',
          description: 'Securing web applications by discovering critical vulnerabilities. Actively researching exploits, crafting write-ups, and helping protect corporate infrastructures.',
          type: 'experience'
        },
        {
          year: '2022 - 2025',
          role: 'BSc Hons (Ethical Hacking & Cyber Security)',
          company: 'Softwarica College of IT and Ecommerce',
          description: 'Completed comprehensive theoretical and practical studies in penetration testing, digital forensics, defensive security, database security, and network defense.',
          type: 'education'
        },
        {
          year: '2022 - Present',
          role: 'Freelance Graphic Designer & Full-Stack Developer',
          company: 'Self-Employed',
          description: 'Building custom websites and graphic designs for various clients, delivering interactive UI/UX features, branding, and promotional banners.',
          type: 'experience'
        },
        {
          year: '2021 - 2022 (Nov)',
          role: 'Assistant Manager (Networking)',
          company: 'Websurfer Company',
          description: 'Managed network operations, assisted clients with routing troubleshooting, configured networking setups, and maintained quality service standards.',
          type: 'experience'
        },
        {
          year: '2020 - 2022',
          role: 'Computer Science in Management',
          company: 'SANN International College',
          description: 'Completed higher secondary education focusing on software fundamentals, database queries, and introductory scripting.',
          type: 'education'
        }
      ];

      for (const e of defaultExperiences) {
        await client.query(
          `INSERT INTO experiences (year, role, company, description, type) VALUES ($1, $2, $3, $4, $5)`,
          [e.year, e.role, e.company, e.description, e.type]
        );
      }
      console.log('[DB] Default experiences seeded.');
    }
  } catch (error) {
    console.error('[DB] Error during initialization:', error);
    throw error;
  } finally {
    client.release();
  }
}

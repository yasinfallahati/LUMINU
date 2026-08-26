import { Router } from 'express';
import bcrypt from 'bcryptjs';
import type Database from 'better-sqlite3';
import { generateToken, authMiddleware, type AuthRequest } from '../middleware/auth';

export function authRoutes(db: Database.Database) {
  const router = Router();

  router.post('/register', (req, res) => {
    try {
      const { name, email, password, phone, role, city, bio, priceRange, specialties } = req.body;

      if (!name || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const result = db.prepare(`
        INSERT INTO users (name, email, password, phone, role, city, bio, price_min, price_max, specialties)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        name,
        email,
        hashedPassword,
        phone,
        role || 'client',
        city || '',
        bio || '',
        priceRange?.min || 0,
        priceRange?.max || 0,
        JSON.stringify(specialties || [])
      );

      const token = generateToken(Number(result.lastInsertRowid), role || 'client');

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

      res.json({
        token,
        user: formatUser(user),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/login', (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.role);

      res.json({
        token,
        user: formatUser(user),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/me', authMiddleware, (req: AuthRequest, res) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user: formatUser(user) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/me', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { name, phone, city, bio, avatar, priceRange, specialties } = req.body;

      db.prepare(`
        UPDATE users SET
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          city = COALESCE(?, city),
          bio = COALESCE(?, bio),
          avatar = COALESCE(?, avatar),
          price_min = COALESCE(?, price_min),
          price_max = COALESCE(?, price_max),
          specialties = COALESCE(?, specialties)
        WHERE id = ?
      `).run(
        name || null,
        phone || null,
        city || null,
        bio || null,
        avatar || null,
        priceRange?.min || null,
        priceRange?.max || null,
        specialties ? JSON.stringify(specialties) : null,
        req.userId
      );

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
      res.json({ user: formatUser(user) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatUser(user: any) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    city: user.city,
    bio: user.bio,
    priceRange: { min: user.price_min, max: user.price_max },
    specialties: JSON.parse(user.specialties || '[]'),
    rating: user.rating,
    reviewCount: user.review_count,
    createdAt: user.created_at,
  };
}

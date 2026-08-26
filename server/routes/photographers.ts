import { Router } from 'express';
import type Database from 'better-sqlite3';

export function photographerRoutes(db: Database.Database) {
  const router = Router();

  router.get('/', (req, res) => {
    try {
      const { city, specialty, search } = req.query;

      let query = 'SELECT * FROM users WHERE role = ?';
      const params: any[] = ['photographer'];

      if (city && city !== 'همه') {
        query += ' AND city = ?';
        params.push(city);
      }

      if (specialty) {
        query += ' AND specialties LIKE ?';
        params.push(`%${specialty}%`);
      }

      if (search) {
        query += ' AND (name LIKE ? OR bio LIKE ? OR specialties LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      const photographers = db.prepare(query).all(...params).map(formatPhotographer);
      res.json({ photographers });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const photographer = db.prepare('SELECT * FROM users WHERE id = ? AND role = ?').get(req.params.id, 'photographer') as any;
      if (!photographer) {
        return res.status(404).json({ error: 'Photographer not found' });
      }
      res.json({ photographer: formatPhotographer(photographer) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatPhotographer(user: any) {
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

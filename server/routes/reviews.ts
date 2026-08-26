import { Router } from 'express';
import type Database from 'better-sqlite3';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

export function reviewRoutes(db: Database.Database) {
  const router = Router();

  router.get('/photographer/:photographerId', (req, res) => {
    try {
      const reviews = db.prepare(`
        SELECT r.*, u.name as client_name, u.avatar as client_avatar
        FROM reviews r JOIN users u ON r.client_id = u.id
        WHERE r.photographer_id = ?
        ORDER BY r.created_at DESC
      `).all(req.params.photographerId);

      res.json({ reviews: reviews.map(formatReview) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { photographerId, rating, comment } = req.body;

      if (!photographerId || !rating) {
        return res.status(400).json({ error: 'Photographer ID and rating are required' });
      }

      const existing = db.prepare(
        'SELECT id FROM reviews WHERE client_id = ? AND photographer_id = ?'
      ).get(req.userId, photographerId);

      if (existing) {
        return res.status(409).json({ error: 'You have already reviewed this photographer' });
      }

      const result = db.prepare(`
        INSERT INTO reviews (client_id, photographer_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `).run(req.userId, photographerId, rating, comment || '');

      const avgRating = db.prepare(
        'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE photographer_id = ?'
      ).get(photographerId) as any;

      db.prepare('UPDATE users SET rating = ?, review_count = ? WHERE id = ?')
        .run(avgRating.avg, avgRating.count, photographerId);

      db.prepare(`
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (?, 'review', 'نظر جدید', 'شما یک نظر جدید دریافت کرده‌اید.')
      `).run(photographerId);

      const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
      res.json({ review: formatReview(review) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatReview(review: any) {
  return {
    id: String(review.id),
    clientId: String(review.client_id),
    photographerId: String(review.photographer_id),
    clientName: review.client_name,
    clientAvatar: review.client_avatar,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at,
  };
}

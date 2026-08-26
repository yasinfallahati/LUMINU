import { Router } from 'express';
import type Database from 'better-sqlite3';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

export function notificationRoutes(db: Database.Database) {
  const router = Router();

  router.get('/', authMiddleware, (req: AuthRequest, res) => {
    try {
      const notifications = db.prepare(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC'
      ).all(req.userId);

      res.json({ notifications: notifications.map(formatNotification) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/unread-count', authMiddleware, (req: AuthRequest, res) => {
    try {
      const result = db.prepare(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0'
      ).get(req.userId) as any;

      res.json({ count: result.count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id/read', authMiddleware, (req: AuthRequest, res) => {
    try {
      db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/read-all', authMiddleware, (req: AuthRequest, res) => {
    try {
      db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.userId);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatNotification(n: any) {
  return {
    id: String(n.id),
    userId: String(n.user_id),
    type: n.type,
    title: n.title,
    message: n.message,
    read: Boolean(n.read),
    createdAt: n.created_at,
  };
}

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

export function bookingRoutes(db: Database.Database) {
  const router = Router();

  router.get('/', authMiddleware, (req: AuthRequest, res) => {
    try {
      let bookings;
      if (req.userRole === 'photographer') {
        bookings = db.prepare(`
          SELECT b.*, u.name as client_name, u.avatar as client_avatar
          FROM bookings b JOIN users u ON b.client_id = u.id
          WHERE b.photographer_id = ?
          ORDER BY b.created_at DESC
        `).all(req.userId);
      } else {
        bookings = db.prepare(`
          SELECT b.*, u.name as photographer_name, u.avatar as photographer_avatar
          FROM bookings b JOIN users u ON b.photographer_id = u.id
          WHERE b.client_id = ?
          ORDER BY b.created_at DESC
        `).all(req.userId);
      }

      res.json({ bookings: bookings.map(formatBooking) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/stats', authMiddleware, (req: AuthRequest, res) => {
    try {
      const total = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE photographer_id = ?').get(req.userId) as any;
      const pending = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE photographer_id = ? AND status = 'pending'").get(req.userId) as any;
      const accepted = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE photographer_id = ? AND status = 'accepted'").get(req.userId) as any;
      const completed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE photographer_id = ? AND status = 'completed'").get(req.userId) as any;
      const rejected = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE photographer_id = ? AND status = 'rejected'").get(req.userId) as any;
      const totalRevenue = db.prepare("SELECT COALESCE(SUM(budget), 0) as total FROM bookings WHERE photographer_id = ? AND status IN ('accepted', 'completed')").get(req.userId) as any;

      const monthlyRevenue = db.prepare(`
        SELECT strftime('%Y-%m', created_at) as month, SUM(budget) as revenue, COUNT(*) as count
        FROM bookings WHERE photographer_id = ? AND status IN ('accepted', 'completed')
        GROUP BY month ORDER BY month DESC LIMIT 12
      `).all(req.userId);

      res.json({
        stats: {
          total: total.count,
          pending: pending.count,
          accepted: accepted.count,
          completed: completed.count,
          rejected: rejected.count,
          totalRevenue: totalRevenue.total,
          monthlyRevenue,
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { photographerId, eventDate, location, budget, message } = req.body;

      if (!photographerId || !eventDate || !location || !budget) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = db.prepare(`
        INSERT INTO bookings (client_id, photographer_id, event_date, location, budget, message)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(req.userId, photographerId, eventDate, location, budget, message || '');

      db.prepare(`
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (?, 'booking', 'درخواست رزرو جدید', 'شما یک درخواست رزرو جدید دریافت کرده‌اید.')
      `).run(photographerId);

      const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
      res.json({ booking: formatBooking(booking) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id/status', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      if (!['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const booking = db.prepare('SELECT * FROM bookings WHERE id = ? AND photographer_id = ?').get(req.params.id, req.userId) as any;
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);

      const statusText = status === 'accepted' ? 'تایید' : status === 'rejected' ? 'رد' : 'تکمیل';
      db.prepare(`
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (?, 'booking', 'وضعیت رزرو', ?)
      `).run(booking.client_id, `رزرو شما ${statusText} شد.`);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatBooking(booking: any) {
  return {
    id: String(booking.id),
    clientId: String(booking.client_id),
    photographerId: String(booking.photographer_id),
    clientName: booking.client_name,
    photographerName: booking.photographer_name,
    eventDate: booking.event_date,
    location: booking.location,
    budget: booking.budget,
    message: booking.message,
    status: booking.status,
    createdAt: booking.created_at,
  };
}

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

export function projectRoutes(db: Database.Database) {
  const router = Router();

  router.get('/', (req, res) => {
    try {
      const { category, photographerId } = req.query;

      let query = 'SELECT p.*, u.name as photographer_name, u.avatar as photographer_avatar FROM projects p JOIN users u ON p.photographer_id = u.id';
      const params: any[] = [];
      const conditions: string[] = [];

      if (category) {
        conditions.push('p.category = ?');
        params.push(category);
      }
      if (photographerId) {
        conditions.push('p.photographer_id = ?');
        params.push(photographerId);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY p.created_at DESC';

      const projects = db.prepare(query).all(...params).map(formatProject);
      res.json({ projects });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const project = db.prepare(`
        SELECT p.*, u.name as photographer_name, u.avatar as photographer_avatar
        FROM projects p JOIN users u ON p.photographer_id = u.id
        WHERE p.id = ?
      `).get(req.params.id) as any;

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      db.prepare('UPDATE projects SET views = views + 1 WHERE id = ?').run(req.params.id);

      res.json({ project: formatProject(project) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { title, description, images, category } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Title, description, and category are required' });
      }

      const result = db.prepare(`
        INSERT INTO projects (photographer_id, title, description, images, category)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.userId, title, description, JSON.stringify(images || []), category);

      const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
      res.json({ project: formatProject(project) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', authMiddleware, (req: AuthRequest, res) => {
    try {
      const project = db.prepare('SELECT * FROM projects WHERE id = ? AND photographer_id = ?').get(req.params.id, req.userId) as any;
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatProject(project: any) {
  return {
    id: String(project.id),
    photographerId: String(project.photographer_id),
    photographerName: project.photographer_name,
    photographerAvatar: project.photographer_avatar,
    title: project.title,
    description: project.description,
    images: JSON.parse(project.images || '[]'),
    category: project.category,
    likes: project.likes,
    views: project.views,
    createdAt: project.created_at,
  };
}

import { Router } from 'express';
import type Database from 'better-sqlite3';
import { authMiddleware, optionalAuth, type AuthRequest } from '../middleware/auth';

export function jobRoutes(db: Database.Database) {
  const router = Router();

  router.get('/', optionalAuth, (req: AuthRequest, res) => {
    try {
      const { category, search, status } = req.query;
      let query = 'SELECT j.*, u.name as client_name FROM jobs j JOIN users u ON j.client_id = u.id WHERE 1=1';
      const params: any[] = [];

      if (category && category !== 'همه') {
        query += ' AND j.category = ?';
        params.push(category);
      }
      if (search) {
        query += ' AND (j.title LIKE ? OR j.description LIKE ? OR j.location LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }
      if (status) {
        query += ' AND j.status = ?';
        params.push(status);
      }

      query += ' ORDER BY j.created_at DESC';

      const jobs = db.prepare(query).all(...params);
      res.json({ jobs: jobs.map(formatJob) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', optionalAuth, (req: AuthRequest, res) => {
    try {
      const job = db.prepare(`
        SELECT j.*, u.name as client_name FROM jobs j JOIN users u ON j.client_id = u.id WHERE j.id = ?
      `).get(req.params.id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({ job: formatJob(job) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { title, description, requirements, category, budget, location, isRemote, isUrgent, deadline } = req.body;

      if (!title || !description || !category || !budget || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = db.prepare(`
        INSERT INTO jobs (client_id, title, description, requirements, category, budget, location, is_remote, is_urgent, deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.userId, title, description, requirements || '', category, budget, location, isRemote ? 1 : 0, isUrgent ? 1 : 0, deadline || null);

      const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid);
      res.json({ job: formatJob(job) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id/proposals', optionalAuth, (req: AuthRequest, res) => {
    try {
      const proposals = db.prepare(`
        SELECT p.*, u.name as photographer_name, u.avatar as photographer_avatar
        FROM proposals p JOIN users u ON p.photographer_id = u.id
        WHERE p.job_id = ?
        ORDER BY p.created_at DESC
      `).all(req.params.id);

      res.json({ proposals: proposals.map(formatProposal) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/:id/proposals', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { coverLetter, proposedBudget, proposedTimeline } = req.body;

      if (!coverLetter || !proposedBudget || !proposedTimeline) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existing = db.prepare('SELECT id FROM proposals WHERE job_id = ? AND photographer_id = ?').get(req.params.id, req.userId);
      if (existing) {
        return res.status(400).json({ error: 'Already submitted a proposal' });
      }

      const result = db.prepare(`
        INSERT INTO proposals (job_id, photographer_id, cover_letter, proposed_budget, proposed_timeline)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.params.id, req.userId, coverLetter, proposedBudget, proposedTimeline);

      db.prepare('UPDATE jobs SET proposal_count = proposal_count + 1 WHERE id = ?').run(req.params.id);

      const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(result.lastInsertRowid);
      res.json({ proposal: formatProposal(proposal) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:jobId/proposals/:proposalId/status', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const job = db.prepare('SELECT * FROM jobs WHERE id = ? AND client_id = ?').get(req.params.jobId, req.userId) as any;
      if (!job) {
        return res.status(404).json({ error: 'Job not found or unauthorized' });
      }

      db.prepare('UPDATE proposals SET status = ? WHERE id = ? AND job_id = ?').run(status, req.params.proposalId, req.params.jobId);

      const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(req.params.proposalId) as any;
      if (proposal) {
        const statusText = status === 'accepted' ? 'تایید' : 'رد';
        db.prepare(`
          INSERT INTO notifications (user_id, type, title, message)
          VALUES (?, 'proposal', 'وضعیت پیشنهاد', ?)
        `).run(proposal.photographer_id, `پیشنهاد شما برای پروژه "${job.title}" ${statusText} شد.`);
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatJob(job: any) {
  return {
    id: String(job.id),
    clientId: String(job.client_id),
    clientName: job.client_name,
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    category: job.category,
    budget: job.budget,
    location: job.location,
    isRemote: !!job.is_remote,
    isUrgent: !!job.is_urgent,
    deadline: job.deadline,
    status: job.status,
    proposalCount: job.proposal_count,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
  };
}

function formatProposal(proposal: any) {
  return {
    id: String(proposal.id),
    jobId: String(proposal.job_id),
    photographerId: String(proposal.photographer_id),
    photographerName: proposal.photographer_name,
    coverLetter: proposal.cover_letter,
    proposedBudget: proposal.proposed_budget,
    proposedTimeline: proposal.proposed_timeline,
    status: proposal.status,
    createdAt: proposal.created_at,
  };
}

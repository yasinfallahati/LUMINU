import { Router } from 'express';
import type Database from 'better-sqlite3';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

export function messageRoutes(db: Database.Database) {
  const router = Router();

  router.get('/chats', authMiddleware, (req: AuthRequest, res) => {
    try {
      const chats = db.prepare('SELECT * FROM chats WHERE participants LIKE ?').all(`%"${req.userId}"%`);

      const formatted = chats.map((chat: any) => {
        const messages = db.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC').all(chat.id);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

        return {
          id: String(chat.id),
          participants: JSON.parse(chat.participants).map(String),
          messages: messages.map(formatMessage),
          lastMessage: lastMessage ? formatMessage(lastMessage) : undefined,
          updatedAt: chat.updated_at,
        };
      });

      res.json({ chats: formatted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/chats', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { participantId } = req.body;
      if (!participantId) {
        return res.status(400).json({ error: 'Participant ID is required' });
      }

      const participants = [req.userId, Number(participantId)].sort();
      const participantsStr = JSON.stringify(participants);

      const existing = db.prepare('SELECT * FROM chats WHERE participants = ?').get(participantsStr) as any;
      if (existing) {
        const messages = db.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC').all(existing.id);
        return res.json({
          chat: {
            id: String(existing.id),
            participants: JSON.parse(existing.participants).map(String),
            messages: messages.map(formatMessage),
            lastMessage: messages.length > 0 ? formatMessage(messages[messages.length - 1]) : undefined,
            updatedAt: existing.updated_at,
          }
        });
      }

      const result = db.prepare('INSERT INTO chats (participants) VALUES (?)').run(participantsStr);

      res.json({
        chat: {
          id: String(result.lastInsertRowid),
          participants: participants.map(String),
          messages: [],
          updatedAt: new Date().toISOString(),
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/chats/:chatId/messages', authMiddleware, (req: AuthRequest, res) => {
    try {
      const { text } = req.body;
      const { chatId } = req.params;

      if (!text) {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId) as any;
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      const participants = JSON.parse(chat.participants);
      const receiverId = participants.find((p: number) => p !== req.userId);

      const result = db.prepare(`
        INSERT INTO messages (chat_id, sender_id, receiver_id, text)
        VALUES (?, ?, ?, ?)
      `).run(chatId, req.userId, receiverId, text);

      db.prepare('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(chatId);

      db.prepare(`
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (?, 'message', 'پیام جدید', 'شما یک پیام جدید دریافت کرده‌اید.')
      `).run(receiverId);

      const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
      res.json({ message: formatMessage(message) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function formatMessage(msg: any) {
  return {
    id: String(msg.id),
    senderId: String(msg.sender_id),
    receiverId: String(msg.receiver_id),
    text: msg.text,
    read: Boolean(msg.read),
    timestamp: msg.created_at,
  };
}

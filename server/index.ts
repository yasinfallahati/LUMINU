import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { authRoutes } from './routes/auth.js';
import { photographerRoutes } from './routes/photographers.js';
import { projectRoutes } from './routes/projects.js';
import { bookingRoutes } from './routes/bookings.js';
import { messageRoutes } from './routes/messages.js';
import { reviewRoutes } from './routes/reviews.js';
import { notificationRoutes } from './routes/notifications.js';
import { jobRoutes } from './routes/jobs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const DB_PATH = path.join(__dirname, '..', 'data', 'lumio.db');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK(role IN ('photographer', 'client')),
    avatar TEXT,
    city TEXT,
    bio TEXT,
    price_min INTEGER DEFAULT 0,
    price_max INTEGER DEFAULT 0,
    specialties TEXT DEFAULT '[]',
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photographer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    category TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    photographer_id INTEGER NOT NULL,
    event_date TEXT NOT NULL,
    location TEXT NOT NULL,
    budget INTEGER NOT NULL,
    message TEXT DEFAULT '',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participants TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    photographer_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT DEFAULT '',
    category TEXT NOT NULL,
    budget INTEGER NOT NULL,
    location TEXT NOT NULL,
    is_remote INTEGER DEFAULT 0,
    is_urgent INTEGER DEFAULT 0,
    deadline TEXT,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'closed', 'filled')),
    proposal_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    photographer_id INTEGER NOT NULL,
    cover_letter TEXT NOT NULL,
    proposed_budget INTEGER NOT NULL,
    proposed_timeline INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, phone, role, avatar, city, bio, price_min, price_max, specialties, rating, review_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    ['علی محمدی', 'ali@example.com', hashPassword('password123'), '09123456789', 'photographer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali', 'تهران', 'عکاس حرفه‌ای با ۱۰ سال سابقه در زمینه عکاسی عروسی و پرتره', 5000000, 50000000, JSON.stringify(['عکاسی عروسی', 'عکاسی پرتره', 'عکاسی محصول']), 4.8, 127],
    ['سارا احمدی', 'sara@example.com', hashPassword('password123'), '09356789012', 'photographer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara', 'تهران', 'عکاس زن با تمرکز بر عکاسی مد و فشن', 3000000, 20000000, JSON.stringify(['عکاسی مد', 'عکاسی فشن', 'عکاسی بوکلئ']), 4.9, 89],
    ['رضا کریمی', 'reza@example.com', hashPassword('password123'), '09129876543', 'photographer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=reza', 'مشهد', 'عکاس طبیعت و گردشگری', 2000000, 15000000, JSON.stringify(['عکاسی طبیعت', 'عکاسی معماری', 'عکاسی گردشگری']), 4.7, 56],
    ['مریم حسینی', 'maryam@example.com', hashPassword('password123'), '09351234567', 'photographer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maryam', 'اصفهان', 'عکاس هنری و خاطره‌انگیز', 4000000, 30000000, JSON.stringify(['عکاسی هنری', 'عکاسی خانواده', 'عکاسی کودک']), 4.6, 42],
    ['محمد رضایی', 'mohammad@example.com', hashPassword('password123'), '09187654321', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammad', 'تهران', '', 0, 0, '[]', 0, 0],
    ['فاطمه نوری', 'fateme@example.com', hashPassword('password123'), '09349876543', 'client', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fateme', 'مشهد', '', 0, 0, '[]', 0, 0],
  ];

  const insertMany = db.transaction((items: any[][]) => {
    for (const item of items) {
      insertUser.run(...item);
    }
  });
  insertMany(users);

  const insertProject = db.prepare(`
    INSERT INTO projects (photographer_id, title, description, images, category, likes, views)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    [1, 'عکاسی عروسی پارک لاله', 'عکاسی از عروسی زیبا در پارک لاله تهران', JSON.stringify(['https://images.unsplash.com/photo-1519741497674-611481863552?w=600', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600']), 'عکاسی عروسی', 234, 1200],
    [1, 'پرتره هنری', 'مجموعه‌ای از پرتره‌های هنری', JSON.stringify(['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600']), 'عکاسی پرتره', 156, 890],
    [2, 'شات‌های مد فشن', 'عکاسی برای مجله فشن', JSON.stringify(['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600']), 'عکاسی مد', 312, 1500],
    [3, 'منظره‌های دشت کاشمر', 'عکاسی از زیبایی‌های طبیعی دشت کاشمر', JSON.stringify(['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600']), 'عکاسی طبیعت', 189, 980],
  ];

  const insertProjects = db.transaction((items: any[][]) => {
    for (const item of items) {
      insertProject.run(...item);
    }
  });
  insertProjects(projects);

  const insertBooking = db.prepare(`
    INSERT INTO bookings (client_id, photographer_id, event_date, location, budget, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertBooking.run(5, 1, '2024-07-15', 'تهران، پارک لاله', 15000000, 'برای عروسی خودم نیاز به عکاس دارم', 'pending');

  const insertReview = db.prepare(`
    INSERT INTO reviews (client_id, photographer_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  insertReview.run(5, 1, 5, 'عالی بود! خیلی حرفه‌ای و با دقت کار کرد.');
  insertReview.run(6, 1, 4, 'خوب بود ولی کمی دیر به دست رسید.');

  const insertChat = db.prepare(`
    INSERT INTO chats (participants) VALUES (?)
  `);
  const chatResult = insertChat.run(JSON.stringify([5, 1]));

  const insertMessage = db.prepare(`
    INSERT INTO messages (chat_id, sender_id, receiver_id, text)
    VALUES (?, ?, ?, ?)
  `);
  insertMessage.run(chatResult.lastInsertRowid, 5, 1, 'سلام، آیا برای تاریخ ۱۵ تیر آزاد هستید؟');
  insertMessage.run(chatResult.lastInsertRowid, 1, 5, 'سلام بله، آن تاریخ آزاد است. لطفا جزئیات بیشتری بگویید.');

  const insertNotification = db.prepare(`
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (?, ?, ?, ?)
  `);
  insertNotification.run(1, 'booking', 'درخواست رزرو جدید', 'محمد رضایی برای شما درخواست رزرو ارسال کرده است.');
  insertNotification.run(5, 'message', 'پیام جدید', 'علی محمدی به پیام شما پاسخ داد.');

  const insertJob = db.prepare(`
    INSERT INTO jobs (client_id, title, description, requirements, category, budget, location, is_remote, is_urgent, deadline, status, proposal_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertJob.run(5, 'عکاسی عروسی در پارک لاله', 'به عکاسی حرفه‌ای برای عروسی خود در پارک لاله تهران نیاز دارم. پروژه شامل عکاسی از مراسم عقد، مراسم عروسی و پذیرایی مهمانان است.', 'حداقل ۵ سال سابقه در عکاسی عروسی، نمونه کار مشابه', 'عکاسی عروسی', 20000000, 'تهران، پارک لاله', 0, 1, '2024-08-15', 'open', 5);
  insertJob.run(6, 'عکاسی محصول برای فروشگاه آنلاین', 'برای فروشگاه آنلاین پوشاک خود به عکاسی حرفه‌ای از محصولات نیاز دارم. حدود ۵۰ محصول برای عکاسی وجود دارد.', 'تجربه در عکاسی محصول، تجهیزات استودیویی', 'عکاسی محصول', 8000000, 'مشهد', 0, 0, '2024-07-30', 'open', 3);
  insertJob.run(5, 'عکاسی پرتره برای کسب‌وکار', 'به یک عکاس حرفه‌ای برای عکاسی پرتره از تیم مدیریتی شرکت خود نیاز دارم.', 'تجربه در عکاسی پرتره شرکتی', 'عکاسی پرتره', 5000000, 'تهران', 0, 0, '2024-07-20', 'open', 8);
  insertJob.run(6, 'عکاسی از جشن تولد کودک', 'برای جشن تولد ۵ سالگی فرزندم به عکاس کودک نیاز دارم. فضای صمیمی و شاد مورد نظر است.', 'تجربه در عکاسی کودک، صبر و حوصله', 'عکاسی رویداد', 3000000, 'اصفهان', 0, 0, '2024-07-10', 'open', 2);

  const insertProposal = db.prepare(`
    INSERT INTO proposals (job_id, photographer_id, cover_letter, proposed_budget, proposed_timeline, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertProposal.run(1, 1, 'با سلام، من بیش از ۱۰ سال سابقه در عکاسی عروسی دارم و با سبک هنری خاصی کار می‌کنم.', 18000000, 1, 'pending');
  insertProposal.run(2, 2, 'برای عکاسی محصول فروشگاه شما، استودیوی مجهز و تجهیزات حرفه‌ای در اختیار دارم.', 7500000, 3, 'accepted');
  insertProposal.run(3, 1, 'با تجربه در عکاسی شرکتی، می‌توانم پرتره‌های حرفه‌ای از تیم شما ثبت کنم.', 4500000, 1, 'rejected');

  console.log('Database seeded successfully');
}

seedDatabase();

app.use('/api/auth', authRoutes(db));
app.use('/api/photographers', photographerRoutes(db));
app.use('/api/projects', projectRoutes(db));
app.use('/api/bookings', bookingRoutes(db));
app.use('/api/messages', messageRoutes(db));
app.use('/api/reviews', reviewRoutes(db));
app.use('/api/notifications', notificationRoutes(db));
app.use('/api/jobs', jobRoutes(db));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { db };

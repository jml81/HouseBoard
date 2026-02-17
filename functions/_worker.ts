import { Hono } from 'hono';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB: D1Database;
}

interface AnnouncementRow {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  is_new: number;
}

interface AnnouncementResponse {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  isNew: boolean;
}

function toResponse(row: AnnouncementRow): AnnouncementResponse {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    category: row.category,
    author: row.author,
    publishedAt: row.published_at,
    isNew: row.is_new === 1,
  };
}

const VALID_CATEGORIES = ['yleinen', 'huolto', 'remontti', 'vesi-sahko'];

const app = new Hono<{ Bindings: Env }>();

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

// List announcements (optional category filter)
app.get('/api/announcements', async (c) => {
  const category = c.req.query('category');

  if (category && !VALID_CATEGORIES.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400);
  }

  const sql = category
    ? 'SELECT * FROM announcements WHERE category = ? ORDER BY published_at DESC'
    : 'SELECT * FROM announcements ORDER BY published_at DESC';

  const params = category ? [category] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<AnnouncementRow>();

  return c.json(results.map(toResponse));
});

// Get single announcement
app.get('/api/announcements/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<AnnouncementRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toResponse(row));
});

// Static assets fallback
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;

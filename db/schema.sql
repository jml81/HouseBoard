CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('yleinen','huolto','remontti','vesi-sahko')),
  author TEXT NOT NULL,
  published_at TEXT NOT NULL,
  is_new INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at DESC);

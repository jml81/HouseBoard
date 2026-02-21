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

-- Building (singleton)
CREATE TABLE IF NOT EXISTS building (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  apartments INTEGER NOT NULL,
  build_year INTEGER NOT NULL,
  management_company TEXT NOT NULL
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sauna','pesutupa','kerhohuone','talkoot')),
  location TEXT NOT NULL,
  booker_name TEXT NOT NULL,
  apartment TEXT NOT NULL,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  interested_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('upcoming','past')),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, date);

-- Materials
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('saannot','kokoukset','talous','kunnossapito','muut')),
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf','xlsx','docx')),
  file_size TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_materials_updated_at ON materials(updated_at DESC);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('yhtiokokous','ylimaarainen-yhtiokokous','hallituksen-kokous')),
  status TEXT NOT NULL CHECK (status IN ('upcoming','completed')),
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- Meeting documents (child of meetings)
CREATE TABLE IF NOT EXISTS meeting_documents (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf','xlsx','docx')),
  file_size TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meeting_documents_meeting_id ON meeting_documents(meeting_id);

-- Board members
CREATE TABLE IF NOT EXISTS board_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('puheenjohtaja','varapuheenjohtaja','jasen','varajasen')),
  apartment TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  term_start TEXT NOT NULL,
  term_end TEXT NOT NULL
);

-- Apartments
CREATE TABLE IF NOT EXISTS apartments (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  staircase TEXT NOT NULL,
  floor INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('1h+k','2h+k','3h+k','4h+k')),
  area REAL NOT NULL,
  shares TEXT NOT NULL,
  resident TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_apartments_staircase ON apartments(staircase);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('isannoitsija','huolto','hallitus','siivous','muu')),
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT
);

-- Marketplace items
CREATE TABLE IF NOT EXISTS marketplace_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('huonekalu','elektroniikka','vaatteet','urheilu','kirjat','muu')),
  condition TEXT NOT NULL CHECK (condition IN ('uusi','hyva','kohtalainen','tyydyttava')),
  status TEXT NOT NULL CHECK (status IN ('available','sold','reserved')),
  seller_name TEXT NOT NULL,
  seller_apartment TEXT NOT NULL,
  published_at TEXT NOT NULL,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_category_status ON marketplace_items(category, status);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_published_at ON marketplace_items(published_at DESC);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  apartment TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('resident','manager')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','locked')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Apartment payments
CREATE TABLE IF NOT EXISTS apartment_payments (
  apartment_id TEXT PRIMARY KEY REFERENCES apartments(id),
  monthly_charge REAL NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid','pending','overdue')),
  last_payment_date TEXT NOT NULL,
  arrears REAL NOT NULL DEFAULT 0,
  hoitovastike REAL NOT NULL,
  rahoitusvastike REAL NOT NULL,
  vesimaksu REAL NOT NULL
);

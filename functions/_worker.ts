import { Hono } from 'hono';
import type { Context, Next } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import { hashPassword, verifyPassword, signJwt, verifyJwt } from './auth-utils.js';
import type { JwtPayload } from './auth-utils.js';
import { createRateLimiter } from './rate-limiter.js';
import { isValidEmail } from './validation-utils.js';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB: D1Database;
  JWT_SECRET: string;
}

type Variables = {
  user: JwtPayload;
};

// --- Row interfaces (snake_case from D1) ---

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

interface BuildingRow {
  id: number;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  apartments: number;
  build_year: number;
  management_company: string;
}

interface BookingRow {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  category: string;
  location: string;
  booker_name: string;
  apartment: string;
  created_by: string | null;
}

interface EventRow {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  interested_count: number;
  status: string;
  created_by: string | null;
}

interface MaterialRow {
  id: string;
  name: string;
  category: string;
  file_type: string;
  file_size: string;
  updated_at: string;
  description: string;
  created_by: string | null;
}

interface MeetingRow {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
}

interface MeetingDocumentRow {
  id: string;
  meeting_id: string;
  name: string;
  file_type: string;
  file_size: string;
}

interface BoardMemberRow {
  id: string;
  name: string;
  role: string;
  apartment: string;
  email: string;
  phone: string;
  term_start: string;
  term_end: string;
}

interface ApartmentRow {
  id: string;
  number: string;
  staircase: string;
  floor: number;
  type: string;
  area: number;
  shares: string;
  resident: string;
}

interface ContactRow {
  id: string;
  name: string;
  role: string;
  company: string | null;
  phone: string;
  email: string;
  description: string | null;
}

interface MarketplaceItemRow {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  seller_name: string;
  seller_apartment: string;
  published_at: string;
  created_by: string | null;
}

interface ApartmentPaymentRow {
  apartment_id: string;
  monthly_charge: number;
  payment_status: string;
  last_payment_date: string;
  arrears: number;
  hoitovastike: number;
  rahoitusvastike: number;
  vesimaksu: number;
}

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  apartment: string;
  role: string;
  status: string;
  created_at: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  apartment: string;
  role: string;
  status: string;
  createdAt: string;
}

function toUserResponse(row: UserRow): UserResponse {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    apartment: row.apartment,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
  };
}

// --- Response interfaces (camelCase for JSON) ---

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

interface BuildingResponse {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  apartments: number;
  buildYear: number;
  managementCompany: string;
}

interface BookingResponse {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  location: string;
  bookerName: string;
  apartment: string;
  createdBy: string | null;
}

interface EventResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  interestedCount: number;
  status: string;
  createdBy: string | null;
}

interface MaterialResponse {
  id: string;
  name: string;
  category: string;
  fileType: string;
  fileSize: string;
  updatedAt: string;
  description: string;
  createdBy: string | null;
}

interface MeetingDocumentResponse {
  id: string;
  name: string;
  fileType: string;
  fileSize: string;
}

interface MeetingResponse {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  documents: MeetingDocumentResponse[];
}

interface BoardMemberResponse {
  id: string;
  name: string;
  role: string;
  apartment: string;
  email: string;
  phone: string;
  termStart: string;
  termEnd: string;
}

interface ApartmentResponse {
  id: string;
  number: string;
  staircase: string;
  floor: number;
  type: string;
  area: number;
  shares: string;
  resident: string;
}

interface ContactResponse {
  id: string;
  name: string;
  role: string;
  company?: string;
  phone: string;
  email: string;
  description?: string;
}

interface MarketplaceItemResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  seller: { name: string; apartment: string };
  publishedAt: string;
  createdBy: string | null;
}

interface ApartmentPaymentResponse {
  apartmentId: string;
  monthlyCharge: number;
  paymentStatus: string;
  lastPaymentDate: string;
  arrears: number;
  chargeBreakdown: { hoitovastike: number; rahoitusvastike: number; vesimaksu: number };
}

// --- Mapper functions ---

function toAnnouncementResponse(row: AnnouncementRow): AnnouncementResponse {
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

function toBuildingResponse(row: BuildingRow): BuildingResponse {
  return {
    name: row.name,
    address: row.address,
    postalCode: row.postal_code,
    city: row.city,
    apartments: row.apartments,
    buildYear: row.build_year,
    managementCompany: row.management_company,
  };
}

function toBookingResponse(row: BookingRow): BookingResponse {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    category: row.category,
    location: row.location,
    bookerName: row.booker_name,
    apartment: row.apartment,
    createdBy: row.created_by,
  };
}

function toEventResponse(row: EventRow): EventResponse {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    organizer: row.organizer,
    interestedCount: row.interested_count,
    status: row.status,
    createdBy: row.created_by,
  };
}

function toMaterialResponse(row: MaterialRow): MaterialResponse {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    fileType: row.file_type,
    fileSize: row.file_size,
    updatedAt: row.updated_at,
    description: row.description,
    createdBy: row.created_by,
  };
}

function toMeetingDocumentResponse(row: MeetingDocumentRow): MeetingDocumentResponse {
  return {
    id: row.id,
    name: row.name,
    fileType: row.file_type,
    fileSize: row.file_size,
  };
}

function toBoardMemberResponse(row: BoardMemberRow): BoardMemberResponse {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    apartment: row.apartment,
    email: row.email,
    phone: row.phone,
    termStart: row.term_start,
    termEnd: row.term_end,
  };
}

function toApartmentResponse(row: ApartmentRow): ApartmentResponse {
  return {
    id: row.id,
    number: row.number,
    staircase: row.staircase,
    floor: row.floor,
    type: row.type,
    area: row.area,
    shares: row.shares,
    resident: row.resident,
  };
}

function toContactResponse(row: ContactRow): ContactResponse {
  const result: ContactResponse = {
    id: row.id,
    name: row.name,
    role: row.role,
    phone: row.phone,
    email: row.email,
  };
  if (row.company !== null) result.company = row.company;
  if (row.description !== null) result.description = row.description;
  return result;
}

function toMarketplaceItemResponse(row: MarketplaceItemRow): MarketplaceItemResponse {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.category,
    condition: row.condition,
    status: row.status,
    seller: { name: row.seller_name, apartment: row.seller_apartment },
    publishedAt: row.published_at,
    createdBy: row.created_by,
  };
}

function toApartmentPaymentResponse(row: ApartmentPaymentRow): ApartmentPaymentResponse {
  return {
    apartmentId: row.apartment_id,
    monthlyCharge: row.monthly_charge,
    paymentStatus: row.payment_status,
    lastPaymentDate: row.last_payment_date,
    arrears: row.arrears,
    chargeBreakdown: {
      hoitovastike: row.hoitovastike,
      rahoitusvastike: row.rahoitusvastike,
      vesimaksu: row.vesimaksu,
    },
  };
}

// --- Validation constants ---

const VALID_ANNOUNCEMENT_CATEGORIES = ['yleinen', 'huolto', 'remontti', 'vesi-sahko'];
const VALID_BOOKING_CATEGORIES = ['sauna', 'pesutupa', 'kerhohuone', 'talkoot'];
const VALID_EVENT_STATUSES = ['upcoming', 'past'];
const VALID_MATERIAL_CATEGORIES = ['saannot', 'kokoukset', 'talous', 'kunnossapito', 'muut'];
const VALID_FILE_TYPES = ['pdf', 'xlsx', 'docx'];
const VALID_MEETING_STATUSES = ['upcoming', 'completed'];
const VALID_CONTACT_ROLES = ['isannoitsija', 'huolto', 'hallitus', 'siivous', 'muu'];
const VALID_MARKETPLACE_CATEGORIES = [
  'huonekalu',
  'elektroniikka',
  'vaatteet',
  'urheilu',
  'kirjat',
  'muu',
];
const VALID_MARKETPLACE_STATUSES = ['available', 'sold', 'reserved'];
const VALID_ITEM_CONDITIONS = ['uusi', 'hyva', 'kohtalainen', 'tyydyttava'];
const VALID_PAYMENT_STATUSES = ['paid', 'pending', 'overdue'];
const VALID_USER_ROLES = ['resident', 'manager'];
const VALID_USER_STATUSES = ['active', 'locked'];

// --- App ---

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// --- Rate limiter ---

const loginRateLimiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });

// --- Security middleware ---

app.use(
  '*',
  secureHeaders({
    strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
  }),
);

app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      if (!origin) return '';
      if (origin.endsWith('.pages.dev') || origin.endsWith('.workers.dev')) return origin;
      if (origin === 'http://localhost:5173' || origin === 'http://localhost:8788') return origin;
      return '';
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }),
);

app.use(
  '/api/*',
  bodyLimit({
    maxSize: 100 * 1024,
    onError: (c) => {
      return c.json({ error: 'Request body too large' }, 413);
    },
  }),
);

// Health check (no auth required)
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

// --- Auth endpoints (no auth required) ---

app.post('/api/auth/login', async (c) => {
  const clientIp = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown';

  if (!loginRateLimiter.check(clientIp)) {
    console.log(JSON.stringify({ event: 'login_rate_limited', ip: clientIp }));
    return c.json({ error: 'Too many login attempts. Please try again later.' }, 429);
  }

  const body = await c.req.json<Record<string, unknown>>();

  if (!body.email || typeof body.email !== 'string' || !body.password || typeof body.password !== 'string') {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  if (!isValidEmail(body.email)) {
    console.log(JSON.stringify({ event: 'login_failed', reason: 'invalid_email_format', ip: clientIp }));
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(body.email)
    .first<UserRow>();

  if (!user) {
    console.log(JSON.stringify({ event: 'login_failed', reason: 'user_not_found', ip: clientIp }));
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const valid = await verifyPassword(body.password, user.password_hash);
  if (!valid) {
    console.log(JSON.stringify({ event: 'login_failed', reason: 'wrong_password', ip: clientIp, userId: user.id }));
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  if (user.status !== 'active') {
    console.log(JSON.stringify({ event: 'login_failed', reason: 'account_locked', ip: clientIp, userId: user.id }));
    return c.json({ error: 'Account is locked' }, 403);
  }

  const token = await signJwt(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      apartment: user.apartment,
      role: user.role as 'resident' | 'manager',
    },
    c.env.JWT_SECRET,
  );

  console.log(JSON.stringify({ event: 'login_success', ip: clientIp, userId: user.id }));
  return c.json({ token, user: toUserResponse(user) });
});

app.get('/api/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Fetch fresh data from DB (name/status may have changed)
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<UserRow>();

  if (!user || user.status !== 'active') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json(toUserResponse(user));
});

// --- JWT authentication middleware (all routes below) ---

app.use('/api/*', async (c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) => {
  // Skip auth endpoints and health check
  const path = new URL(c.req.url).pathname;
  if (path === '/api/health' || path.startsWith('/api/auth/')) {
    return next();
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Check user still exists and is active
  const userStatus = await c.env.DB.prepare('SELECT status FROM users WHERE id = ?')
    .bind(payload.sub)
    .first<{ status: string }>();

  if (!userStatus || userStatus.status !== 'active') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', payload);
  return next();
});

// --- Manager-only middleware for mutation endpoints ---

function requireManager(): (c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) => Promise<Response | void> {
  return async (c, next) => {
    const user = c.get('user');
    if (user.role !== 'manager') {
      return c.json({ error: 'Forbidden: manager role required' }, 403);
    }
    return next();
  };
}

// --- Announcements ---

app.get('/api/announcements', async (c) => {
  const category = c.req.query('category');

  if (category && !VALID_ANNOUNCEMENT_CATEGORIES.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400);
  }

  const sql = category
    ? 'SELECT * FROM announcements WHERE category = ? ORDER BY published_at DESC'
    : 'SELECT * FROM announcements ORDER BY published_at DESC';

  const params = category ? [category] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<AnnouncementRow>();

  return c.json(results.map(toAnnouncementResponse));
});

app.get('/api/announcements/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<AnnouncementRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toAnnouncementResponse(row));
});

app.post('/api/announcements', requireManager(), async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required');
  }
  if (!body.summary || typeof body.summary !== 'string' || body.summary.trim() === '') {
    errors.push('summary is required');
  }
  if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
    errors.push('content is required');
  }
  if (!body.category || !VALID_ANNOUNCEMENT_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }
  if (!body.author || typeof body.author !== 'string' || body.author.trim() === '') {
    errors.push('author is required');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const id = crypto.randomUUID();
  const publishedAt = new Date().toISOString().slice(0, 10);

  await c.env.DB.prepare(
    `INSERT INTO announcements (id, title, summary, content, category, author, published_at, is_new)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
  )
    .bind(
      id,
      (body.title as string).trim(),
      (body.summary as string).trim(),
      (body.content as string).trim(),
      body.category as string,
      (body.author as string).trim(),
      publishedAt,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<AnnouncementRow>();

  return c.json(toAnnouncementResponse(row!), 201);
});

app.patch('/api/announcements/:id', requireManager(), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Record<string, unknown>>();

  const existing = await c.env.DB.prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<AnnouncementRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  const errors: string[] = [];
  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
    errors.push('title cannot be empty');
  }
  if (body.summary !== undefined && (typeof body.summary !== 'string' || body.summary.trim() === '')) {
    errors.push('summary cannot be empty');
  }
  if (body.content !== undefined && (typeof body.content !== 'string' || body.content.trim() === '')) {
    errors.push('content cannot be empty');
  }
  if (body.category !== undefined && !VALID_ANNOUNCEMENT_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const updates: string[] = [];
  const params: (string | number)[] = [];

  if (body.title !== undefined) {
    updates.push('title = ?');
    params.push((body.title as string).trim());
  }
  if (body.summary !== undefined) {
    updates.push('summary = ?');
    params.push((body.summary as string).trim());
  }
  if (body.content !== undefined) {
    updates.push('content = ?');
    params.push((body.content as string).trim());
  }
  if (body.category !== undefined) {
    updates.push('category = ?');
    params.push(body.category as string);
  }

  if (updates.length > 0) {
    params.push(id);
    await c.env.DB.prepare(`UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<AnnouncementRow>();

  return c.json(toAnnouncementResponse(row!));
});

app.delete('/api/announcements/:id', requireManager(), async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT * FROM announcements WHERE id = ?')
    .bind(id)
    .first<AnnouncementRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM announcements WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// --- Building ---

app.get('/api/building', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM building WHERE id = 1').first<BuildingRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toBuildingResponse(row));
});

// --- Bookings ---

app.get('/api/bookings', async (c) => {
  const category = c.req.query('category');

  if (category && !VALID_BOOKING_CATEGORIES.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400);
  }

  const sql = category
    ? 'SELECT * FROM bookings WHERE category = ? ORDER BY date, start_time'
    : 'SELECT * FROM bookings ORDER BY date, start_time';

  const params = category ? [category] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<BookingRow>();

  return c.json(results.map(toBookingResponse));
});

app.get('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(id)
    .first<BookingRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toBookingResponse(row));
});

// Category defaults for auto-fill
const BOOKING_CATEGORY_DEFAULTS: Record<string, { title: string; location: string }> = {
  sauna: { title: 'Saunavuoro', location: 'Taloyhtiön sauna' },
  pesutupa: { title: 'Pesutupavuoro', location: 'Taloyhtiön pesutupa' },
  kerhohuone: { title: 'Kerhohuonevaraus', location: 'Kerhohuone' },
  talkoot: { title: 'Talkoot', location: 'Piha-alue' },
};

app.post('/api/bookings', async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.category || !VALID_BOOKING_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }
  if (!body.date || typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('date is required (YYYY-MM-DD)');
  }
  if (
    !body.startTime ||
    typeof body.startTime !== 'string' ||
    !/^\d{2}:\d{2}$/.test(body.startTime)
  ) {
    errors.push('startTime is required (HH:mm)');
  }
  if (!body.endTime || typeof body.endTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.endTime)) {
    errors.push('endTime is required (HH:mm)');
  }
  if (
    body.startTime &&
    body.endTime &&
    typeof body.startTime === 'string' &&
    typeof body.endTime === 'string' &&
    body.endTime <= body.startTime
  ) {
    errors.push('endTime must be after startTime');
  }
  if (!body.bookerName || typeof body.bookerName !== 'string' || body.bookerName.trim() === '') {
    errors.push('bookerName is required');
  }
  if (!body.apartment || typeof body.apartment !== 'string' || body.apartment.trim() === '') {
    errors.push('apartment is required');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  // Overlap check
  const overlapResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as cnt FROM bookings WHERE category = ? AND date = ? AND start_time < ? AND end_time > ?',
  )
    .bind(body.category as string, body.date as string, body.endTime as string, body.startTime as string)
    .first<{ cnt: number }>();

  if (overlapResult && overlapResult.cnt > 0) {
    return c.json({ error: 'Booking overlaps with an existing booking' }, 409);
  }

  const id = crypto.randomUUID();
  const defaults = BOOKING_CATEGORY_DEFAULTS[body.category as string] ?? {
    title: 'Varaus',
    location: '',
  };
  const title =
    body.title && typeof body.title === 'string' && body.title.trim() !== ''
      ? body.title.trim()
      : defaults.title;
  const location =
    body.location && typeof body.location === 'string' && body.location.trim() !== ''
      ? body.location.trim()
      : defaults.location;

  const user = c.get('user');

  await c.env.DB.prepare(
    `INSERT INTO bookings (id, title, date, start_time, end_time, category, location, booker_name, apartment, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      title,
      body.date as string,
      body.startTime as string,
      body.endTime as string,
      body.category as string,
      location,
      (body.bookerName as string).trim(),
      (body.apartment as string).trim(),
      user.sub,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(id)
    .first<BookingRow>();

  return c.json(toBookingResponse(row!), 201);
});

app.patch('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Record<string, unknown>>();

  const existing = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(id)
    .first<BookingRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Ownership check: only owner or manager can update
  const user = c.get('user');
  if (existing.created_by !== null && existing.created_by !== user.sub && user.role !== 'manager') {
    return c.json({ error: 'Forbidden: not the owner' }, 403);
  }

  const errors: string[] = [];
  if (body.category !== undefined && !VALID_BOOKING_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }
  if (body.date !== undefined && (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date))) {
    errors.push('invalid date format (YYYY-MM-DD)');
  }
  if (body.startTime !== undefined && (typeof body.startTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.startTime))) {
    errors.push('invalid startTime format (HH:mm)');
  }
  if (body.endTime !== undefined && (typeof body.endTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.endTime))) {
    errors.push('invalid endTime format (HH:mm)');
  }

  const newStartTime = (body.startTime as string | undefined) ?? existing.start_time;
  const newEndTime = (body.endTime as string | undefined) ?? existing.end_time;
  if (newEndTime <= newStartTime) {
    errors.push('endTime must be after startTime');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  // Overlap check with new values (exclude self)
  const newCategory = (body.category as string | undefined) ?? existing.category;
  const newDate = (body.date as string | undefined) ?? existing.date;

  const overlapResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as cnt FROM bookings WHERE category = ? AND date = ? AND start_time < ? AND end_time > ? AND id != ?',
  )
    .bind(newCategory, newDate, newEndTime, newStartTime, id)
    .first<{ cnt: number }>();

  if (overlapResult && overlapResult.cnt > 0) {
    return c.json({ error: 'Booking overlaps with an existing booking' }, 409);
  }

  // Build dynamic UPDATE
  const updates: string[] = [];
  const params: (string | number)[] = [];

  if (body.category !== undefined) {
    updates.push('category = ?');
    params.push(body.category as string);
  }
  if (body.date !== undefined) {
    updates.push('date = ?');
    params.push(body.date as string);
  }
  if (body.startTime !== undefined) {
    updates.push('start_time = ?');
    params.push(body.startTime as string);
  }
  if (body.endTime !== undefined) {
    updates.push('end_time = ?');
    params.push(body.endTime as string);
  }
  if (body.title !== undefined) {
    updates.push('title = ?');
    params.push((body.title as string).trim());
  }
  if (body.location !== undefined) {
    updates.push('location = ?');
    params.push((body.location as string).trim());
  }

  if (updates.length > 0) {
    params.push(id);
    await c.env.DB.prepare(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(id)
    .first<BookingRow>();

  return c.json(toBookingResponse(row!));
});

app.delete('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(id)
    .first<BookingRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Ownership check: only owner or manager can delete
  const user = c.get('user');
  if (existing.created_by !== null && existing.created_by !== user.sub && user.role !== 'manager') {
    return c.json({ error: 'Forbidden: not the owner' }, 403);
  }

  await c.env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// --- Events ---

app.get('/api/events', async (c) => {
  const status = c.req.query('status');

  if (status && !VALID_EVENT_STATUSES.includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const sql = status
    ? 'SELECT * FROM events WHERE status = ? ORDER BY date'
    : 'SELECT * FROM events ORDER BY date';

  const params = status ? [status] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<EventRow>();

  return c.json(results.map(toEventResponse));
});

app.get('/api/events/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first<EventRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toEventResponse(row));
});

app.post('/api/events', requireManager(), async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required');
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
    errors.push('description is required');
  }
  if (!body.date || typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('date is required (YYYY-MM-DD)');
  }
  if (!body.startTime || typeof body.startTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.startTime)) {
    errors.push('startTime is required (HH:mm)');
  }
  if (!body.endTime || typeof body.endTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.endTime)) {
    errors.push('endTime is required (HH:mm)');
  }
  if (
    body.startTime &&
    body.endTime &&
    typeof body.startTime === 'string' &&
    typeof body.endTime === 'string' &&
    body.endTime <= body.startTime
  ) {
    errors.push('endTime must be after startTime');
  }
  if (!body.location || typeof body.location !== 'string' || body.location.trim() === '') {
    errors.push('location is required');
  }
  if (!body.organizer || typeof body.organizer !== 'string' || body.organizer.trim() === '') {
    errors.push('organizer is required');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const id = crypto.randomUUID();
  const user = c.get('user');

  await c.env.DB.prepare(
    `INSERT INTO events (id, title, description, date, start_time, end_time, location, organizer, interested_count, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'upcoming', ?)`,
  )
    .bind(
      id,
      (body.title as string).trim(),
      (body.description as string).trim(),
      body.date as string,
      body.startTime as string,
      body.endTime as string,
      (body.location as string).trim(),
      (body.organizer as string).trim(),
      user.sub,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first<EventRow>();

  return c.json(toEventResponse(row!), 201);
});

app.patch('/api/events/:id', requireManager(), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Record<string, unknown>>();

  const existing = await c.env.DB.prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first<EventRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  const errors: string[] = [];
  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
    errors.push('title cannot be empty');
  }
  if (body.description !== undefined && (typeof body.description !== 'string' || body.description.trim() === '')) {
    errors.push('description cannot be empty');
  }
  if (body.date !== undefined && (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date))) {
    errors.push('invalid date format (YYYY-MM-DD)');
  }
  if (body.startTime !== undefined && (typeof body.startTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.startTime))) {
    errors.push('invalid startTime format (HH:mm)');
  }
  if (body.endTime !== undefined && (typeof body.endTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.endTime))) {
    errors.push('invalid endTime format (HH:mm)');
  }
  if (body.location !== undefined && (typeof body.location !== 'string' || body.location.trim() === '')) {
    errors.push('location cannot be empty');
  }
  if (body.organizer !== undefined && (typeof body.organizer !== 'string' || body.organizer.trim() === '')) {
    errors.push('organizer cannot be empty');
  }
  if (body.status !== undefined && !VALID_EVENT_STATUSES.includes(body.status as string)) {
    errors.push('invalid status');
  }

  const newStartTime = (body.startTime as string | undefined) ?? existing.start_time;
  const newEndTime = (body.endTime as string | undefined) ?? existing.end_time;
  if (newEndTime <= newStartTime) {
    errors.push('endTime must be after startTime');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const updates: string[] = [];
  const params: (string | number)[] = [];

  if (body.title !== undefined) {
    updates.push('title = ?');
    params.push((body.title as string).trim());
  }
  if (body.description !== undefined) {
    updates.push('description = ?');
    params.push((body.description as string).trim());
  }
  if (body.date !== undefined) {
    updates.push('date = ?');
    params.push(body.date as string);
  }
  if (body.startTime !== undefined) {
    updates.push('start_time = ?');
    params.push(body.startTime as string);
  }
  if (body.endTime !== undefined) {
    updates.push('end_time = ?');
    params.push(body.endTime as string);
  }
  if (body.location !== undefined) {
    updates.push('location = ?');
    params.push((body.location as string).trim());
  }
  if (body.organizer !== undefined) {
    updates.push('organizer = ?');
    params.push((body.organizer as string).trim());
  }
  if (body.status !== undefined) {
    updates.push('status = ?');
    params.push(body.status as string);
  }

  if (updates.length > 0) {
    params.push(id);
    await c.env.DB.prepare(`UPDATE events SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first<EventRow>();

  return c.json(toEventResponse(row!));
});

app.delete('/api/events/:id', requireManager(), async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT * FROM events WHERE id = ?')
    .bind(id)
    .first<EventRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM events WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// --- Materials ---

app.get('/api/materials', async (c) => {
  const category = c.req.query('category');

  if (category && !VALID_MATERIAL_CATEGORIES.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400);
  }

  const sql = category
    ? 'SELECT * FROM materials WHERE category = ? ORDER BY updated_at DESC'
    : 'SELECT * FROM materials ORDER BY updated_at DESC';

  const params = category ? [category] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<MaterialRow>();

  return c.json(results.map(toMaterialResponse));
});

app.get('/api/materials/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM materials WHERE id = ?')
    .bind(id)
    .first<MaterialRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toMaterialResponse(row));
});

app.post('/api/materials', requireManager(), async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required');
  }
  if (!body.category || !VALID_MATERIAL_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }
  if (!body.fileType || !VALID_FILE_TYPES.includes(body.fileType as string)) {
    errors.push('invalid fileType');
  }
  if (!body.fileSize || typeof body.fileSize !== 'string' || body.fileSize.trim() === '') {
    errors.push('fileSize is required');
  }
  if (!body.updatedAt || typeof body.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.updatedAt)) {
    errors.push('updatedAt is required (YYYY-MM-DD)');
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
    errors.push('description is required');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const id = crypto.randomUUID();
  const user = c.get('user');

  await c.env.DB.prepare(
    `INSERT INTO materials (id, name, category, file_type, file_size, updated_at, description, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      (body.name as string).trim(),
      body.category as string,
      body.fileType as string,
      (body.fileSize as string).trim(),
      body.updatedAt as string,
      (body.description as string).trim(),
      user.sub,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM materials WHERE id = ?')
    .bind(id)
    .first<MaterialRow>();

  return c.json(toMaterialResponse(row!), 201);
});

app.patch('/api/materials/:id', requireManager(), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Record<string, unknown>>();

  const existing = await c.env.DB.prepare('SELECT * FROM materials WHERE id = ?')
    .bind(id)
    .first<MaterialRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  const errors: string[] = [];
  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
    errors.push('name cannot be empty');
  }
  if (body.category !== undefined && !VALID_MATERIAL_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }
  if (body.fileType !== undefined && !VALID_FILE_TYPES.includes(body.fileType as string)) {
    errors.push('invalid fileType');
  }
  if (body.fileSize !== undefined && (typeof body.fileSize !== 'string' || body.fileSize.trim() === '')) {
    errors.push('fileSize cannot be empty');
  }
  if (body.updatedAt !== undefined && (typeof body.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.updatedAt))) {
    errors.push('invalid updatedAt format (YYYY-MM-DD)');
  }
  if (body.description !== undefined && (typeof body.description !== 'string' || body.description.trim() === '')) {
    errors.push('description cannot be empty');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const updates: string[] = [];
  const params: string[] = [];

  if (body.name !== undefined) {
    updates.push('name = ?');
    params.push((body.name as string).trim());
  }
  if (body.category !== undefined) {
    updates.push('category = ?');
    params.push(body.category as string);
  }
  if (body.fileType !== undefined) {
    updates.push('file_type = ?');
    params.push(body.fileType as string);
  }
  if (body.fileSize !== undefined) {
    updates.push('file_size = ?');
    params.push((body.fileSize as string).trim());
  }
  if (body.updatedAt !== undefined) {
    updates.push('updated_at = ?');
    params.push(body.updatedAt as string);
  }
  if (body.description !== undefined) {
    updates.push('description = ?');
    params.push((body.description as string).trim());
  }

  if (updates.length > 0) {
    params.push(id);
    await c.env.DB.prepare(`UPDATE materials SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM materials WHERE id = ?')
    .bind(id)
    .first<MaterialRow>();

  return c.json(toMaterialResponse(row!));
});

app.delete('/api/materials/:id', requireManager(), async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT * FROM materials WHERE id = ?')
    .bind(id)
    .first<MaterialRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM materials WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// --- Meetings (with documents) ---

app.get('/api/meetings', async (c) => {
  const status = c.req.query('status');

  if (status && !VALID_MEETING_STATUSES.includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const meetingSql = status
    ? 'SELECT * FROM meetings WHERE status = ? ORDER BY date DESC'
    : 'SELECT * FROM meetings ORDER BY date DESC';

  const meetingParams = status ? [status] : [];
  const { results: meetingRows } = await c.env.DB.prepare(meetingSql)
    .bind(...meetingParams)
    .all<MeetingRow>();

  const { results: docRows } = await c.env.DB.prepare(
    'SELECT * FROM meeting_documents ORDER BY id',
  ).all<MeetingDocumentRow>();

  const docsByMeeting = new Map<string, MeetingDocumentResponse[]>();
  for (const doc of docRows) {
    const list = docsByMeeting.get(doc.meeting_id) ?? [];
    list.push(toMeetingDocumentResponse(doc));
    docsByMeeting.set(doc.meeting_id, list);
  }

  const response: MeetingResponse[] = meetingRows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    description: row.description,
    documents: docsByMeeting.get(row.id) ?? [],
  }));

  return c.json(response);
});

app.get('/api/meetings/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM meetings WHERE id = ?')
    .bind(id)
    .first<MeetingRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const { results: docRows } = await c.env.DB.prepare(
    'SELECT * FROM meeting_documents WHERE meeting_id = ? ORDER BY id',
  )
    .bind(id)
    .all<MeetingDocumentRow>();

  const response: MeetingResponse = {
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    description: row.description,
    documents: docRows.map(toMeetingDocumentResponse),
  };

  return c.json(response);
});

// --- Board members ---

app.get('/api/board-members', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM board_members ORDER BY id',
  ).all<BoardMemberRow>();

  return c.json(results.map(toBoardMemberResponse));
});

// --- Apartments ---

app.get('/api/apartments', async (c) => {
  const staircase = c.req.query('staircase');

  if (staircase && !['A', 'B', 'C'].includes(staircase)) {
    return c.json({ error: 'Invalid staircase' }, 400);
  }

  const sql = staircase
    ? 'SELECT * FROM apartments WHERE staircase = ? ORDER BY id'
    : 'SELECT * FROM apartments ORDER BY id';

  const params = staircase ? [staircase] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<ApartmentRow>();

  return c.json(results.map(toApartmentResponse));
});

// --- Contacts ---

app.get('/api/contacts', async (c) => {
  const role = c.req.query('role');

  if (role && !VALID_CONTACT_ROLES.includes(role)) {
    return c.json({ error: 'Invalid role' }, 400);
  }

  const sql = role
    ? 'SELECT * FROM contacts WHERE role = ? ORDER BY id'
    : 'SELECT * FROM contacts ORDER BY id';

  const params = role ? [role] : [];
  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<ContactRow>();

  return c.json(results.map(toContactResponse));
});

// --- Marketplace items ---

app.get('/api/marketplace-items', async (c) => {
  const category = c.req.query('category');
  const status = c.req.query('status');
  const search = c.req.query('search');

  if (category && !VALID_MARKETPLACE_CATEGORIES.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400);
  }
  if (status && !VALID_MARKETPLACE_STATUSES.includes(status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const conditions: string[] = [];
  const params: string[] = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('(title LIKE ? OR description LIKE ?)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }

  const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM marketplace_items${where} ORDER BY published_at DESC`;

  const { results } = await c.env.DB.prepare(sql)
    .bind(...params)
    .all<MarketplaceItemRow>();

  return c.json(results.map(toMarketplaceItemResponse));
});

app.get('/api/marketplace-items/:id', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM marketplace_items WHERE id = ?')
    .bind(id)
    .first<MarketplaceItemRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toMarketplaceItemResponse(row));
});

app.post('/api/marketplace-items', async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required');
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') {
    errors.push('description is required');
  }
  if (typeof body.price !== 'number' || body.price < 0) {
    errors.push('price must be a non-negative number');
  }
  if (!body.category || !VALID_MARKETPLACE_CATEGORIES.includes(body.category as string)) {
    errors.push('invalid category');
  }
  if (!body.condition || !VALID_ITEM_CONDITIONS.includes(body.condition as string)) {
    errors.push('invalid condition');
  }
  if (!body.sellerName || typeof body.sellerName !== 'string') {
    errors.push('sellerName is required');
  }
  if (!body.sellerApartment || typeof body.sellerApartment !== 'string') {
    errors.push('sellerApartment is required');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const id = crypto.randomUUID();
  const publishedAt = new Date().toISOString().slice(0, 10);
  const user = c.get('user');

  await c.env.DB.prepare(
    `INSERT INTO marketplace_items (id, title, description, price, category, condition, status, seller_name, seller_apartment, published_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, 'available', ?, ?, ?, ?)`,
  )
    .bind(
      id,
      (body.title as string).trim(),
      (body.description as string).trim(),
      body.price as number,
      body.category as string,
      body.condition as string,
      (body.sellerName as string).trim(),
      (body.sellerApartment as string).trim(),
      publishedAt,
      user.sub,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM marketplace_items WHERE id = ?')
    .bind(id)
    .first<MarketplaceItemRow>();

  return c.json(toMarketplaceItemResponse(row!), 201);
});

app.patch('/api/marketplace-items/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Record<string, unknown>>();

  if (!body.status || !VALID_MARKETPLACE_STATUSES.includes(body.status as string)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const existing = await c.env.DB.prepare('SELECT * FROM marketplace_items WHERE id = ?')
    .bind(id)
    .first<MarketplaceItemRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Ownership check: only owner or manager can update
  const user = c.get('user');
  if (existing.created_by !== null && existing.created_by !== user.sub && user.role !== 'manager') {
    return c.json({ error: 'Forbidden: not the owner' }, 403);
  }

  await c.env.DB.prepare('UPDATE marketplace_items SET status = ? WHERE id = ?')
    .bind(body.status as string, id)
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM marketplace_items WHERE id = ?')
    .bind(id)
    .first<MarketplaceItemRow>();

  return c.json(toMarketplaceItemResponse(row!));
});

app.delete('/api/marketplace-items/:id', async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT * FROM marketplace_items WHERE id = ?')
    .bind(id)
    .first<MarketplaceItemRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Ownership check: only owner or manager can delete
  const user = c.get('user');
  if (existing.created_by !== null && existing.created_by !== user.sub && user.role !== 'manager') {
    return c.json({ error: 'Forbidden: not the owner' }, 403);
  }

  await c.env.DB.prepare('DELETE FROM marketplace_items WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// --- Apartment payments ---

app.get('/api/apartment-payments', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM apartment_payments ORDER BY apartment_id',
  ).all<ApartmentPaymentRow>();

  return c.json(results.map(toApartmentPaymentResponse));
});

app.get('/api/apartments/:id/payments', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT * FROM apartment_payments WHERE apartment_id = ?')
    .bind(id)
    .first<ApartmentPaymentRow>();

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(toApartmentPaymentResponse(row));
});

app.post('/api/apartment-payments', requireManager(), async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.apartmentId || typeof body.apartmentId !== 'string') {
    errors.push('apartmentId is required');
  }
  if (!body.paymentStatus || !VALID_PAYMENT_STATUSES.includes(body.paymentStatus as string)) {
    errors.push('invalid paymentStatus');
  }
  if (!body.lastPaymentDate || typeof body.lastPaymentDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.lastPaymentDate)) {
    errors.push('lastPaymentDate is required (YYYY-MM-DD)');
  }
  if (typeof body.arrears !== 'number' || body.arrears < 0) {
    errors.push('arrears must be a non-negative number');
  }
  if (typeof body.hoitovastike !== 'number' || body.hoitovastike < 0) {
    errors.push('hoitovastike must be a non-negative number');
  }
  if (typeof body.rahoitusvastike !== 'number' || body.rahoitusvastike < 0) {
    errors.push('rahoitusvastike must be a non-negative number');
  }
  if (typeof body.vesimaksu !== 'number' || body.vesimaksu < 0) {
    errors.push('vesimaksu must be a non-negative number');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  // Check apartment exists
  const apartment = await c.env.DB.prepare('SELECT id FROM apartments WHERE id = ?')
    .bind(body.apartmentId as string)
    .first();

  if (!apartment) {
    return c.json({ error: 'Apartment not found' }, 404);
  }

  // Check for duplicate
  const existing = await c.env.DB.prepare('SELECT apartment_id FROM apartment_payments WHERE apartment_id = ?')
    .bind(body.apartmentId as string)
    .first();

  if (existing) {
    return c.json({ error: 'Apartment already has payment info' }, 409);
  }

  const monthlyCharge = (body.hoitovastike as number) + (body.rahoitusvastike as number) + (body.vesimaksu as number);

  await c.env.DB.prepare(
    `INSERT INTO apartment_payments (apartment_id, monthly_charge, payment_status, last_payment_date, arrears, hoitovastike, rahoitusvastike, vesimaksu)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      body.apartmentId as string,
      monthlyCharge,
      body.paymentStatus as string,
      body.lastPaymentDate as string,
      body.arrears as number,
      body.hoitovastike as number,
      body.rahoitusvastike as number,
      body.vesimaksu as number,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM apartment_payments WHERE apartment_id = ?')
    .bind(body.apartmentId as string)
    .first<ApartmentPaymentRow>();

  return c.json(toApartmentPaymentResponse(row!), 201);
});

app.patch('/api/apartment-payments/:apartmentId', requireManager(), async (c) => {
  const apartmentId = c.req.param('apartmentId');
  const body = await c.req.json<Record<string, unknown>>();

  const existing = await c.env.DB.prepare('SELECT * FROM apartment_payments WHERE apartment_id = ?')
    .bind(apartmentId)
    .first<ApartmentPaymentRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  const errors: string[] = [];
  if (body.paymentStatus !== undefined && !VALID_PAYMENT_STATUSES.includes(body.paymentStatus as string)) {
    errors.push('invalid paymentStatus');
  }
  if (body.lastPaymentDate !== undefined && (typeof body.lastPaymentDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.lastPaymentDate))) {
    errors.push('invalid lastPaymentDate format (YYYY-MM-DD)');
  }
  if (body.arrears !== undefined && (typeof body.arrears !== 'number' || body.arrears < 0)) {
    errors.push('arrears must be a non-negative number');
  }
  if (body.hoitovastike !== undefined && (typeof body.hoitovastike !== 'number' || body.hoitovastike < 0)) {
    errors.push('hoitovastike must be a non-negative number');
  }
  if (body.rahoitusvastike !== undefined && (typeof body.rahoitusvastike !== 'number' || body.rahoitusvastike < 0)) {
    errors.push('rahoitusvastike must be a non-negative number');
  }
  if (body.vesimaksu !== undefined && (typeof body.vesimaksu !== 'number' || body.vesimaksu < 0)) {
    errors.push('vesimaksu must be a non-negative number');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const updates: string[] = [];
  const params: (string | number)[] = [];

  if (body.paymentStatus !== undefined) {
    updates.push('payment_status = ?');
    params.push(body.paymentStatus as string);
  }
  if (body.lastPaymentDate !== undefined) {
    updates.push('last_payment_date = ?');
    params.push(body.lastPaymentDate as string);
  }
  if (body.arrears !== undefined) {
    updates.push('arrears = ?');
    params.push(body.arrears as number);
  }
  if (body.hoitovastike !== undefined) {
    updates.push('hoitovastike = ?');
    params.push(body.hoitovastike as number);
  }
  if (body.rahoitusvastike !== undefined) {
    updates.push('rahoitusvastike = ?');
    params.push(body.rahoitusvastike as number);
  }
  if (body.vesimaksu !== undefined) {
    updates.push('vesimaksu = ?');
    params.push(body.vesimaksu as number);
  }

  // Recalculate monthly_charge if any charge component changed
  if (body.hoitovastike !== undefined || body.rahoitusvastike !== undefined || body.vesimaksu !== undefined) {
    const newHoitovastike = (body.hoitovastike as number | undefined) ?? existing.hoitovastike;
    const newRahoitusvastike = (body.rahoitusvastike as number | undefined) ?? existing.rahoitusvastike;
    const newVesimaksu = (body.vesimaksu as number | undefined) ?? existing.vesimaksu;
    const monthlyCharge = newHoitovastike + newRahoitusvastike + newVesimaksu;
    updates.push('monthly_charge = ?');
    params.push(monthlyCharge);
  }

  if (updates.length > 0) {
    params.push(apartmentId);
    await c.env.DB.prepare(`UPDATE apartment_payments SET ${updates.join(', ')} WHERE apartment_id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM apartment_payments WHERE apartment_id = ?')
    .bind(apartmentId)
    .first<ApartmentPaymentRow>();

  return c.json(toApartmentPaymentResponse(row!));
});

app.delete('/api/apartment-payments/:apartmentId', requireManager(), async (c) => {
  const apartmentId = c.req.param('apartmentId');

  const existing = await c.env.DB.prepare('SELECT apartment_id FROM apartment_payments WHERE apartment_id = ?')
    .bind(apartmentId)
    .first();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM apartment_payments WHERE apartment_id = ?').bind(apartmentId).run();

  return c.json({ success: true });
});

// --- User management (manager only) ---

app.get('/api/users', requireManager(), async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM users ORDER BY created_at',
  ).all<UserRow>();

  return c.json(results.map(toUserResponse));
});

app.post('/api/users', requireManager(), async (c) => {
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push('email is required');
  }
  if (!body.password || typeof body.password !== 'string' || (body.password as string).length < 8) {
    errors.push('password must be at least 8 characters');
  }
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required');
  }
  if (!body.apartment || typeof body.apartment !== 'string' || body.apartment.trim() === '') {
    errors.push('apartment is required');
  }
  if (!body.role || !VALID_USER_ROLES.includes(body.role as string)) {
    errors.push('invalid role');
  }
  if (body.email && typeof body.email === 'string' && !isValidEmail(body.email.trim())) {
    errors.push('invalid email format');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  // Check email uniqueness
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind((body.email as string).trim().toLowerCase())
    .first();

  if (existing) {
    return c.json({ error: 'Email already in use' }, 409);
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(body.password as string);

  await c.env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, apartment, role, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'active', datetime('now'))`,
  )
    .bind(
      id,
      (body.email as string).trim().toLowerCase(),
      passwordHash,
      (body.name as string).trim(),
      (body.apartment as string).trim(),
      body.role as string,
    )
    .run();

  const row = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<UserRow>();

  return c.json(toUserResponse(row!), 201);
});

app.patch('/api/users/:id', requireManager(), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<Record<string, unknown>>();
  const currentUser = c.get('user');

  const existing = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<UserRow>();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Prevent self-demotion, self-locking
  if (id === currentUser.sub) {
    if (body.role !== undefined && body.role !== existing.role) {
      return c.json({ error: 'Cannot change own role' }, 403);
    }
    if (body.status !== undefined && body.status !== existing.status) {
      return c.json({ error: 'Cannot change own status' }, 403);
    }
  }

  const errors: string[] = [];
  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
    errors.push('name cannot be empty');
  }
  if (body.apartment !== undefined && (typeof body.apartment !== 'string' || body.apartment.trim() === '')) {
    errors.push('apartment cannot be empty');
  }
  if (body.role !== undefined && !VALID_USER_ROLES.includes(body.role as string)) {
    errors.push('invalid role');
  }
  if (body.status !== undefined && !VALID_USER_STATUSES.includes(body.status as string)) {
    errors.push('invalid status');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const updates: string[] = [];
  const params: string[] = [];

  if (body.name !== undefined) {
    updates.push('name = ?');
    params.push((body.name as string).trim());
  }
  if (body.apartment !== undefined) {
    updates.push('apartment = ?');
    params.push((body.apartment as string).trim());
  }
  if (body.role !== undefined) {
    updates.push('role = ?');
    params.push(body.role as string);
  }
  if (body.status !== undefined) {
    updates.push('status = ?');
    params.push(body.status as string);
  }

  if (updates.length > 0) {
    params.push(id);
    await c.env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<UserRow>();

  return c.json(toUserResponse(row!));
});

app.delete('/api/users/:id', requireManager(), async (c) => {
  const id = c.req.param('id');
  const currentUser = c.get('user');

  if (id === currentUser.sub) {
    return c.json({ error: 'Cannot delete own account' }, 403);
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE id = ?')
    .bind(id)
    .first();

  if (!existing) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Nullify created_by references
  await c.env.DB.prepare('UPDATE bookings SET created_by = NULL WHERE created_by = ?')
    .bind(id)
    .run();
  await c.env.DB.prepare('UPDATE marketplace_items SET created_by = NULL WHERE created_by = ?')
    .bind(id)
    .run();
  await c.env.DB.prepare('UPDATE events SET created_by = NULL WHERE created_by = ?')
    .bind(id)
    .run();
  await c.env.DB.prepare('UPDATE materials SET created_by = NULL WHERE created_by = ?')
    .bind(id)
    .run();

  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

  return c.json({ success: true });
});

// --- Profile (authenticated user) ---

app.patch('/api/profile', async (c) => {
  const currentUser = c.get('user');
  const body = await c.req.json<Record<string, unknown>>();

  const errors: string[] = [];
  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
    errors.push('name cannot be empty');
  }
  if (body.apartment !== undefined && (typeof body.apartment !== 'string' || body.apartment.trim() === '')) {
    errors.push('apartment cannot be empty');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  const updates: string[] = [];
  const params: string[] = [];

  if (body.name !== undefined) {
    updates.push('name = ?');
    params.push((body.name as string).trim());
  }
  if (body.apartment !== undefined) {
    updates.push('apartment = ?');
    params.push((body.apartment as string).trim());
  }

  if (updates.length > 0) {
    params.push(currentUser.sub);
    await c.env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run();
  }

  const row = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(currentUser.sub)
    .first<UserRow>();

  return c.json(toUserResponse(row!));
});

app.post('/api/profile/change-password', async (c) => {
  const currentUser = c.get('user');
  const body = await c.req.json<Record<string, unknown>>();

  if (!body.currentPassword || typeof body.currentPassword !== 'string') {
    return c.json({ error: 'Current password is required' }, 400);
  }
  if (!body.newPassword || typeof body.newPassword !== 'string' || (body.newPassword as string).length < 8) {
    return c.json({ error: 'New password must be at least 8 characters' }, 400);
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(currentUser.sub)
    .first<UserRow>();

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const valid = await verifyPassword(body.currentPassword as string, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Current password is incorrect' }, 401);
  }

  const newHash = await hashPassword(body.newPassword as string);
  await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    .bind(newHash, currentUser.sub)
    .run();

  return c.json({ success: true });
});

// Static assets fallback
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;

import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB: D1Database;
}

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
}

interface MaterialRow {
  id: string;
  name: string;
  category: string;
  file_type: string;
  file_size: string;
  updated_at: string;
  description: string;
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
}

interface MaterialResponse {
  id: string;
  name: string;
  category: string;
  fileType: string;
  fileSize: string;
  updatedAt: string;
  description: string;
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

// --- App ---

const app = new Hono<{ Bindings: Env }>();

// Basic authentication
app.use(
  '*',
  basicAuth({
    username: 'demo',
    password: 'Talo2026!',
  }),
);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

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

// Static assets fallback
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;

'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8080);
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = process.env.MUKA_DB_PATH || path.join(DATA_DIR, 'muka.sqlite');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    language TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    experience TEXT,
    guests TEXT,
    preferred_date TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new'
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    language TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
`);

const insertInquiry = db.prepare('INSERT INTO inquiries (created_at, language, name, email, experience, guests, preferred_date, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertSubscriber = db.prepare('INSERT OR IGNORE INTO subscribers (created_at, language, email) VALUES (?, ?, ?)');
const listInquiries = db.prepare('SELECT * FROM inquiries ORDER BY id DESC');
const listSubscribers = db.prepare('SELECT * FROM subscribers ORDER BY id DESC');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store'});
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 65536) reject(new Error('too_large')); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('invalid_json')); } });
    req.on('error', reject);
  });
}

const clean = (value, max = 1000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
function tokenMatches(req) {
  if (!ADMIN_TOKEN) return false;
  const supplied = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(supplied); const b = Buffer.from(ADMIN_TOKEN);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function api(req, res, pathname) {
  try {
    if (req.method === 'POST' && pathname === '/api/inquiries') {
      const data = await readJson(req);
      const name = clean(data.name, 120), email = clean(data.email, 180).toLowerCase();
      if (!name || !emailPattern.test(email)) return sendJson(res, 400, {ok:false, error:'invalid_fields'});
      const result = insertInquiry.run(new Date().toISOString(), data.language === 'en' ? 'en' : 'tr', name, email, clean(data.experience, 160), clean(data.guests, 100), clean(data.preferredDate, 100), clean(data.message, 3000));
      const id = Number(result.lastInsertRowid);
      return sendJson(res, 201, {ok:true, id, reference:`MUKA-${String(id).padStart(4, '0')}`});
    }
    if (req.method === 'POST' && pathname === '/api/subscribers') {
      const data = await readJson(req); const email = clean(data.email, 180).toLowerCase();
      if (!emailPattern.test(email)) return sendJson(res, 400, {ok:false, error:'invalid_email'});
      const result = insertSubscriber.run(new Date().toISOString(), data.language === 'en' ? 'en' : 'tr', email);
      return sendJson(res, result.changes ? 201 : 200, {ok:true, alreadySubscribed:!result.changes});
    }
    if (req.method === 'GET' && pathname === '/api/admin/data') {
      if (!ADMIN_TOKEN) return sendJson(res, 503, {ok:false, error:'admin_not_configured'});
      if (!tokenMatches(req)) return sendJson(res, 401, {ok:false, error:'unauthorized'});
      return sendJson(res, 200, {ok:true, inquiries:listInquiries.all(), subscribers:listSubscribers.all()});
    }
    sendJson(res, 404, {ok:false, error:'not_found'});
  } catch (error) {
    sendJson(res, error.message === 'too_large' ? 413 : 400, {ok:false, error:error.message || 'request_failed'});
  }
}

function serveStatic(req, res, pathname) {
  const aliases = {'/':'/index.html','/bilgi-al':'/bilgi-al.html','/admin':'/admin.html'};
  const requested = aliases[pathname] || pathname;
  const filePath = path.resolve(ROOT, `.${decodeURIComponent(requested)}`);
  if (!filePath.startsWith(ROOT + path.sep) || filePath.startsWith(DATA_DIR + path.sep)) return sendJson(res, 403, {ok:false, error:'forbidden'});
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) return sendJson(res, 404, {ok:false, error:'not_found'});
    res.writeHead(200, {'Content-Type':mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  if (pathname.startsWith('/api/')) return api(req, res, pathname);
  if (!['GET','HEAD'].includes(req.method)) return sendJson(res, 405, {ok:false, error:'method_not_allowed'});
  serveStatic(req, res, pathname);
});
server.listen(PORT, () => console.log(`Muka: http://localhost:${PORT} | Yönetim: http://localhost:${PORT}/admin`));

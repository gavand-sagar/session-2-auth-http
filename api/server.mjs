// Fake REST API for the Product Manager app. No dependencies, data lives in memory.
// Run: npm run api   (http://localhost:3200)
// Login: admin@shop.test / admin123

import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = 3200;
const USERS = [{ email: 'admin@shop.test', password: 'admin123', name: 'Admin' }];
const CATEGORIES = ['electronics', 'books', 'toys', 'home'];

let products = [
  { id: 1, name: 'Keyboard', category: 'electronics', price: 1500, stock: 25 },
  { id: 2, name: 'Mouse', category: 'electronics', price: 700, stock: 4 },
  { id: 3, name: 'Monitor', category: 'electronics', price: 9000, stock: 8 },
  { id: 4, name: 'Angular in Practice', category: 'books', price: 650, stock: 40 },
  { id: 5, name: 'RxJS Handbook', category: 'books', price: 550, stock: 2 },
  { id: 6, name: 'Building Blocks', category: 'toys', price: 1200, stock: 15 },
  { id: 7, name: 'Desk Lamp', category: 'home', price: 900, stock: 0 },
];
let nextId = 8;
const sessions = new Map(); // token -> user

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

async function readBody(req) {
  let data = '';
  for await (const chunk of req) data += chunk;
  try {
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function currentUser(req) {
  const header = req.headers.authorization ?? '';
  return header.startsWith('Bearer ') ? sessions.get(header.slice(7)) : undefined;
}

function validate(body) {
  const errors = {};
  if (!body.name || String(body.name).trim().length < 3) errors.name = 'Name must be at least 3 characters';
  if (products.some((p) => p.name.toLowerCase() === String(body.name ?? '').trim().toLowerCase() && p.id !== body.id)) {
    errors.name = 'A product with this name already exists';
  }
  if (!CATEGORIES.includes(body.category)) errors.category = 'Choose a valid category';
  if (!(Number(body.price) > 0)) errors.price = 'Price must be greater than 0';
  if (!(Number(body.stock) >= 0)) errors.stock = 'Stock cannot be negative';
  return Object.keys(errors).length ? errors : null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const [, api, resource, idPart] = url.pathname.split('/');
  const id = Number(idPart);
  const method = req.method;
  console.log(`${method.padEnd(6)} ${req.url}`);
  await delay(400); // a realistic network delay, so loading states are visible

  if (api !== 'api') return send(res, 404, { message: 'Not found' });

  // POST /api/auth/login
  if (resource === 'auth' && idPart === 'login' && method === 'POST') {
    const { email, password } = await readBody(req);
    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) return send(res, 401, { message: 'Wrong email or password' });
    const token = randomUUID();
    sessions.set(token, { name: user.name, email: user.email });
    return send(res, 200, { token, user: sessions.get(token) });
  }

  // Everything below needs a valid token
  const user = currentUser(req);
  if (!user) return send(res, 401, { message: 'Please log in' });

  if (resource === 'categories' && method === 'GET') {
    return send(res, 200, CATEGORIES.map((name) => ({ name, count: products.filter((p) => p.category === name).length })));
  }

  if (resource === 'stats' && method === 'GET') {
    const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, products.filter((p) => p.category === c).length]));
    return send(res, 200, {
      totalProducts: products.length,
      stockValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
      lowStock: products.filter((p) => p.stock < 5),
      byCategory,
    });
  }

  if (resource === 'products') {
    // GET /api/products?search=&category=&sort=name|price
    if (method === 'GET' && !idPart) {
      const search = (url.searchParams.get('search') ?? '').toLowerCase();
      if (search === 'error') return send(res, 500, { message: 'Search service crashed' });
      const category = url.searchParams.get('category');
      const sort = url.searchParams.get('sort') ?? 'name';
      let list = products.filter((p) => p.name.toLowerCase().includes(search));
      if (category) list = list.filter((p) => p.category === category);
      list.sort((a, b) => (sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));
      return send(res, 200, list);
    }

    if (method === 'POST' && !idPart) {
      const body = await readBody(req);
      const errors = validate(body);
      if (errors) return send(res, 400, { message: 'Validation failed', errors });
      const product = { id: nextId++, name: body.name.trim(), category: body.category, price: Number(body.price), stock: Number(body.stock) };
      products.push(product);
      return send(res, 201, product);
    }

    const product = products.find((p) => p.id === id);
    if (!product) return send(res, 404, { message: `Product ${idPart} not found` });

    if (method === 'GET') return send(res, 200, product);

    if (method === 'PUT') {
      const body = await readBody(req);
      const errors = validate({ ...body, id });
      if (errors) return send(res, 400, { message: 'Validation failed', errors });
      Object.assign(product, { name: body.name.trim(), category: body.category, price: Number(body.price), stock: Number(body.stock) });
      return send(res, 200, product);
    }

    if (method === 'DELETE') {
      products = products.filter((p) => p.id !== id);
      return send(res, 204);
    }
  }

  send(res, 404, { message: `No route for ${method} ${url.pathname}` });
});

server.listen(PORT, () => console.log(`Product Manager API on http://localhost:${PORT}/api`));

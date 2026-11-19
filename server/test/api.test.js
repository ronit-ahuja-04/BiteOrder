// API tests: authentication, RBAC, validation, CRUD and IDOR protection.
// Needs a MongoDB: TEST_MONGODB_URI (default mongodb://127.0.0.1:27017/biteorder_test). Run:  npm test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_ci_only';
process.env.JWT_EXPIRES_IN = '1h';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

const URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/biteorder_test';
const J = { 'Content-Type': 'application/json' };
let adminToken, aToken, bToken, aOrderId, bOrderId, menuId;
const bearer = (t) => ({ Authorization: `Bearer ${t}` });

before(async () => {
  await mongoose.connect(URI);
  await mongoose.connection.dropDatabase();
  await User.create({ name: 'Test Admin', email: 'admin@test.com', password: 'Admin@1234', role: 'admin' });
});
after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('register creates a customer, returns a token and never exposes the password', async () => {
  const res = await request(app).post('/api/auth/register').send({ name: 'Asha Test', email: 'asha@test.com', password: 'Test@1234', role: 'admin' });
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.role, 'customer');       // role in the body is ignored
  assert.equal(res.body.user.password, undefined);
  aToken = res.body.token;
  const b = await request(app).post('/api/auth/register').send({ name: 'Bala Test', email: 'bala@test.com', password: 'Test@1234' });
  bToken = b.body.token;
});

test('register rejects duplicates (409) and invalid input (400)', async () => {
  const dup = await request(app).post('/api/auth/register').send({ name: 'Asha Test', email: 'asha@test.com', password: 'Test@1234' });
  assert.equal(dup.status, 409);
  const bad = await request(app).post('/api/auth/register').send({ name: 'A', email: 'not-an-email', password: '123' });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.errors.length, 3);
});

test('login: correct credentials 200, wrong password 401, missing fields 400', async () => {
  const ok = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Admin@1234' });
  assert.equal(ok.status, 200);
  adminToken = ok.body.token;
  const wrong = await request(app).post('/api/auth/login').send({ email: 'asha@test.com', password: 'wrong-password' });
  assert.equal(wrong.status, 401);
  const missing = await request(app).post('/api/auth/login').send({ email: 'asha@test.com' });
  assert.equal(missing.status, 400);
});

test('protected route: no token 401, tampered token 401, valid token 200', async () => {
  assert.equal((await request(app).get('/api/auth/me')).status, 401);
  assert.equal((await request(app).get('/api/auth/me').set(bearer(aToken + 'x'))).status, 401);
  const me = await request(app).get('/api/auth/me').set(bearer(aToken));
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, 'asha@test.com');
});

test('RBAC: customer gets 403 on admin endpoints, admin gets 200', async () => {
  assert.equal((await request(app).get('/api/auth/users').set(bearer(aToken))).status, 403);
  const adminList = await request(app).get('/api/auth/users').set(bearer(adminToken));
  assert.equal(adminList.status, 200);
  assert.equal(adminList.body.count, 3);
  assert.equal((await request(app).get('/api/orders').set(bearer(aToken))).status, 403);
});

test('menu CRUD: public read, admin-only write, validation and status codes', async () => {
  const item = { name: 'Test Dish', category: 'mains', price: 199 };
  assert.equal((await request(app).post('/api/menu').send(item)).status, 401);
  assert.equal((await request(app).post('/api/menu').set(bearer(aToken)).send(item)).status, 403);
  const bad = await request(app).post('/api/menu').set(bearer(adminToken)).send({ name: '', category: 'pizza', price: -5 });
  assert.equal(bad.status, 400);
  const created = await request(app).post('/api/menu').set(bearer(adminToken)).send(item);
  assert.equal(created.status, 201);
  menuId = created.body.data._id;
  assert.equal((await request(app).get('/api/menu')).status, 200);
  assert.equal((await request(app).get(`/api/menu/${menuId}`)).body.data.name, 'Test Dish');
  const upd = await request(app).put(`/api/menu/${menuId}`).set(bearer(adminToken)).send({ price: 249 });
  assert.equal(upd.status, 200);
  assert.equal(upd.body.data.price, 249);
  assert.equal((await request(app).get('/api/menu/abc')).status, 400);
  assert.equal((await request(app).delete(`/api/menu/${menuId}`).set(bearer(adminToken))).status, 200);
  assert.equal((await request(app).get(`/api/menu/${menuId}`)).status, 404);
});

test('orders: validation, placing, and "my orders"', async () => {
  const empty = await request(app).post('/api/orders').set(bearer(aToken)).send({ items: [] });
  assert.equal(empty.status, 400);
  const mk = (name, mobile) => ({ tableNumber: '5', orderType: 'dine-in', items: [{ name: 'Dish', quantity: 1 }], total: 100, customer: { name, mobile } });
  const a = await request(app).post('/api/orders').set(bearer(aToken)).send(mk('Asha Test', '9000000101'));
  const b = await request(app).post('/api/orders').set(bearer(bToken)).send(mk('Bala Test', '9000000102'));
  assert.equal(a.status, 201);
  aOrderId = a.body.data.orderId;
  bOrderId = b.body.data.orderId;
  const mine = await request(app).get('/api/orders/my').set(bearer(aToken));
  assert.equal(mine.body.count, 1);
  assert.equal(mine.body.data[0].orderId, aOrderId);
});

test('IDOR protection: users can only read their own orders', async () => {
  assert.equal((await request(app).get(`/api/orders/${aOrderId}`).set(bearer(aToken))).status, 200);   // own order
  const cross = await request(app).get(`/api/orders/${bOrderId}`).set(bearer(aToken));                 // someone else's
  assert.equal(cross.status, 404);
  assert.equal(JSON.stringify(cross.body).includes('Bala'), false);                                    // nothing leaked
  assert.equal((await request(app).get(`/api/orders/${bOrderId}`)).status, 401);                       // no token
  assert.equal((await request(app).get(`/api/orders/${bOrderId}`).set(bearer(adminToken))).status, 200); // admin allowed
});

test('IDOR protection on profiles: own profile 200, other user 403, no token 401', async () => {
  const idOf = async (t) => (await request(app).get('/api/auth/me').set(bearer(t))).body.user._id;
  const aId = await idOf(aToken), bId = await idOf(bToken);
  const own = await request(app).get(`/api/profiles/${aId}`).set(bearer(aToken));
  assert.equal(own.status, 200);
  assert.equal(own.body.profile.email, 'asha@test.com');
  assert.equal(own.body.profile.password, undefined);
  const cross = await request(app).get(`/api/profiles/${bId}`).set(bearer(aToken));
  assert.equal(cross.status, 403);
  assert.equal(JSON.stringify(cross.body).includes('bala@test.com'), false);
  assert.equal((await request(app).get(`/api/profiles/${bId}`)).status, 401);
  assert.equal((await request(app).get(`/api/profiles/${bId}`).set(bearer(adminToken))).status, 200); // admin allowed
});

test('admin can update order status; invalid status rejected', async () => {
  const bad = await request(app).put(`/api/orders/${aOrderId}`).set(bearer(adminToken)).send({ status: 'Teleported' });
  assert.equal(bad.status, 400);
  const ok = await request(app).put(`/api/orders/${aOrderId}`).set(bearer(adminToken)).send({ status: 'Preparing' });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.data.status, 'Preparing');
});

test('unknown route returns a JSON 404 and broken JSON returns 400', async () => {
  const nf = await request(app).get('/api/nope');
  assert.equal(nf.status, 404);
  assert.equal(nf.body.success, false);
  const broken = await request(app).post('/api/auth/login').set(J).send('{"email": ');
  assert.equal(broken.status, 400);
});

test('health check', async () => {
  assert.equal((await request(app).get('/health')).body.status, 'ok');
});

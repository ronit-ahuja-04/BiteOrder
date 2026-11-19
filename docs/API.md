# BiteOrder – REST API Documentation

Base URL (local): `http://localhost:5001` · Production: `https://<your-render-app>.onrender.com`
All bodies are JSON. A ready-made **Postman collection** is in [`BiteOrder_Postman_Collection.json`](../BiteOrder_Postman_Collection.json) (import it, set `baseUrl` and `adminPassword`, then run *Auth → Login*).

## Authentication

Protected routes need a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens come from `POST /api/auth/register` or `POST /api/auth/login` and expire after `JWT_EXPIRES_IN` (default 1 day).
Roles: `customer` (default) and `admin`. Admin accounts cannot be created through the API – the role in a register request is ignored.

## Standard responses

Success: `{ "success": true, ... }` · Errors: `{ "success": false, "message": "..." }`

| Status | Meaning |
|---|---|
| 200 / 201 | OK / Created |
| 400 | Validation error, malformed ObjectId or malformed JSON |
| 401 | Missing, invalid or expired token; wrong credentials |
| 403 | Authenticated but not allowed (wrong role, or not the owner) |
| 404 | Resource (or route) not found |
| 409 | Duplicate (e.g. email already registered) |
| 429 | Too many login/register attempts (rate limit: 50 per 15 min) |
| 500 | Unexpected server error (details are logged server-side only) |

## Auth

| Method & path | Access | Body / notes | Success | Errors |
|---|---|---|---|---|
| `POST /api/auth/register` | Public | `{ name (2-60), email, password (6-72) }` | 201 `{ token, user }` | 400, 409 |
| `POST /api/auth/login` | Public | `{ email, password }` | 200 `{ token, user }` | 400, 401 |
| `GET /api/auth/me` | Logged in | – | 200 `{ user }` | 401 |
| `GET /api/auth/users` | **Admin** | – | 200 `{ count, data[] }` | 401, 403 |

Example – login:
```http
POST /api/auth/login
{ "email": "demo.user@biteorder.com", "password": "Demo@1234" }
→ 200 { "success": true, "message": "Login successful.", "token": "eyJ...", "user": { "_id": "...", "name": "Demo Customer", "role": "customer" } }
```
Passwords are hashed with bcrypt and are never returned.

## Profiles

| Method & path | Access | Notes | Success | Errors |
|---|---|---|---|---|
| `GET /api/profiles/:id` | Owner (or admin) | `:id` = the user's `_id`. **IDOR-protected**: a customer asking for another user's id gets 403. | 200 `{ profile }` | 401, 403, 404 |

## Menu

| Method & path | Access | Body / query | Success | Errors |
|---|---|---|---|---|
| `GET /api/menu` | Public | `?category=starters&q=paneer` | 200 `{ count, data[] }` | – |
| `GET /api/menu/:id` | Public | – | 200 `{ data }` | 400 (bad id), 404 |
| `POST /api/menu` | **Admin** | `{ name, category (starters/mains/breads/desserts/beverages), price ≥ 1, ... }` | 201 `{ data }` | 400, 401, 403 |
| `PUT /api/menu/:id` | **Admin** | any subset of the fields above | 200 `{ data }` | 400, 401, 403, 404 |
| `DELETE /api/menu/:id` | **Admin** | – | 200 `{ deletedData }` | 400, 401, 403, 404 |
| `GET /api/categories` | Public | – | 200 `{ data[] }` | – |

Every create / update / delete also broadcasts a live notification (see *Real-time events*).

## Orders

| Method & path | Access | Body / notes | Success | Errors |
|---|---|---|---|---|
| `POST /api/orders` | Public (linked to the user when a token is sent) | `{ items[≥1], tableNumber, orderType (dine-in/takeaway), subtotal, gst, total, customer{name, mobile} }` | 201 `{ data }` | 400 |
| `GET /api/orders/my` | Logged in | the caller's orders, newest first | 200 `{ count, data[] }` | 401 |
| `GET /api/orders/:orderId` | **Owner or admin** (IDOR-protected) | e.g. `BO-1001-ABC` | 200 `{ data }` | 401, 404 (also when it belongs to someone else) |
| `GET /api/orders` | **Admin** | each order includes the account (`user.name`, `user.email`) via `populate` | 200 `{ count, data[] }` | 401, 403 |
| `PUT /api/orders/:orderId` | **Admin** | `{ status: Pending/Preparing/Ready/Served/Cancelled }` | 200 `{ data }` | 400, 401, 403, 404 |
| `DELETE /api/orders/:orderId` | **Admin** | – | 200 | 401, 403, 404 |

## System

| Path | Description |
|---|---|
| `GET /health` | `{ "status": "ok", "uptime": ... }` – used by Docker/Render health checks |
| `GET /` | JSON index of all endpoints |

## Real-time events (Socket.IO)

Connect to the same origin as the API (`io("http://localhost:5001")`).

| Event | Direction | Payload |
|---|---|---|
| `welcome` | server → that client | `{ message, id }` after connecting |
| `notification` | server → **all** clients | `{ id, type: created/updated/deleted, message, item{id,name,category,price}, by, timestamp }` – emitted when an admin creates, updates or deletes a menu item |

The server logs every connection and disconnection.

## Rules enforced by the API (security summary)

- Input validation on register, login, menu and order bodies (express-validator) + Mongoose schema validation
- bcrypt password hashing, `password` field excluded from queries (`select: false`)
- JWT verification middleware (`protect`), role middleware (`adminOnly`), ownership checks (orders, profiles)
- Helmet security headers, CORS restricted by `CLIENT_ORIGIN`, rate limiting on login/register, 100 kb body limit
- Central error handler (no stack traces or internals leaked in production), request logging with morgan

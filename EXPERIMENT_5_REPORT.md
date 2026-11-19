# Experiment – 5
## Integration of MongoDB and Mongoose with RESTful APIs
**Using Node.js, Express.js, MongoDB Atlas, Mongoose and Postman**

**Name:** Ronit Ahuja  **Class:** D15A  **Roll No.:** 63  **Date:** 11/11/26

---

## 1. Aim
To integrate MongoDB with the existing BiteOrder RESTful API using Mongoose, implement persistent CRUD operations, and test the APIs using Postman.

## 2. Problem Statement
Extend the BiteOrder Restaurant Ordering System API by replacing the in-memory `menuItems` / `orders` arrays with MongoDB. Configure MongoDB Atlas, connect Express using Mongoose, implement CRUD operations, test with Postman, and display database records in the React frontend.

## 3. Theory Questions

**1. What is MongoDB Atlas, and why is it used?**
MongoDB Atlas is MongoDB's fully managed cloud database service. It hosts clusters on AWS/GCP/Azure and handles provisioning, backups, scaling, monitoring and security (IP allow-list, users, TLS), so developers do not install or maintain database servers. It has a free tier, which suits development and academic projects.

**2. What is Mongoose? Explain the purpose of schemas and models.**
Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. A **schema** defines the structure of documents in a collection: field types, defaults, and validation rules (`required`, `min`, `enum`). A **model** is a class compiled from a schema (`mongoose.model('MenuItem', menuItemSchema)`) that provides the methods to query and modify the collection (`find`, `create`, …).

**3. What is the purpose of `MONGODB_URI` and `mongoose.connect()`?**
`MONGODB_URI` is the connection string (host, credentials, database name, options) stored as an environment variable. `mongoose.connect(uri)` opens the connection pool to that database; all models use this connection for their operations.

**4. Differentiate between in-memory storage and MongoDB storage.**

| In-memory (arrays) | MongoDB |
|---|---|
| Data lives in RAM; lost on every server restart | Persisted on disk; survives restarts |
| Single process only | Shared by many servers/clients |
| No validation, manual ID generation | Schema validation, auto `ObjectId` |
| Linear scans with `filter`/`find` | Indexed, query-optimised |
| Not scalable | Scalable (replication, sharding) |

**5. Purpose of the Mongoose methods**
- `find(filter)` – returns all documents matching the filter (all if empty).
- `findById(id)` – returns one document by its `_id`, or `null`.
- `create(data)` – validates and inserts a new document.
- `findByIdAndUpdate(id, update, {returnDocument:'after', runValidators:true})` – updates a document and returns the updated version.
- `findByIdAndDelete(id)` – removes a document and returns the deleted one.

**6. What is MongoDB ObjectId?**
A 12-byte (24 hex characters) unique identifier automatically assigned as `_id` to each document. It contains a timestamp, random value and counter, so it is unique across machines without a central counter and roughly sortable by creation time.

**7. Why should database credentials be stored in a `.env` file?**
Credentials hard-coded in source end up in Git history and public repositories, where they can be stolen and abused. `.env` keeps secrets outside the code, is listed in `.gitignore`, and lets each environment (dev/test/prod) use different values without code changes. Only `.env.example` (placeholders) is committed.

---

## 4. Code

### 4.1 MongoDB Atlas configuration
1. Create a free **M0 cluster** on MongoDB Atlas.
2. *Database Access* → add a database user.
3. *Network Access* → allow your IP (or `0.0.0.0/0` for development).
4. *Connect → Drivers* → copy the connection string into `server/.env`.

### 4.2 `.env` and `config/db.js`
`server/.env` (never committed – see `.env.example`):
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/biteorder?retryWrites=true&w=majority
```
`server/config/db.js`:
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined. Copy .env.example to .env and set it.');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (db: ${conn.connection.name})`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
```
`server/server.js` loads `dotenv`, connects first, and starts listening only after the DB is ready:
```js
require('dotenv').config({ quiet: true });
...
connectDB().then(() => app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`)));
```

### 4.3 Schema and model – `models/MenuItem.js` (the "Event" equivalent)
```js
const menuItemSchema = new mongoose.Schema({
  name:     { type: String, required: [true, '"name" is a required field.'], trim: true },
  category: { type: String, required: true, trim: true, lowercase: true,
              enum: ['starters','mains','breads','desserts','beverages'] },
  price:    { type: Number, required: true, min: [1, '"price" must be a positive number.'] },
  halfPrice: Number,
  isVeg: { type: Boolean, default: true },
  description: { type: String, default: 'Delicious handcrafted chef specialty dish.' },
  image, rating, ratingCount, prepTime, calories, isBestseller, isChefSpecial,
  availableAddons: [addonSchema],
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
```
A second model, `models/Order.js`, stores placed orders (`orderId`, `items`, `total`, `status` enum, `customer`).

### 4.4 Five CRUD operations – `controllers/menuController.js`
```js
// READ ALL   GET /api/menu
const items = await MenuItem.find(filter).sort({ createdAt: 1 });

// READ ONE   GET /api/menu/:id
const item = await MenuItem.findById(req.params.id);

// CREATE     POST /api/menu
const item = await MenuItem.create(body);                       // 201

// UPDATE     PUT /api/menu/:id
const item = await MenuItem.findByIdAndUpdate(req.params.id, updates,
                                              { returnDocument: 'after', runValidators: true });

// DELETE     DELETE /api/menu/:id
const item = await MenuItem.findByIdAndDelete(req.params.id);
```

### 4.5 Validation and error handling
```js
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);   // 400 for malformed ObjectId

const handleError = (res, error, fallback) => {
  if (error.name === 'ValidationError')                           // schema rule violated → 400
    return res.status(400).json({ success: false,
      message: `Validation Error: ${Object.values(error.errors).map(e => e.message).join(' ')}` });
  if (error.name === 'CastError')                                 // wrong type → 400
    return res.status(400).json({ success: false, message: `Invalid value for "${error.path}"` });
  res.status(500).json({ success: false, message: fallback, error: error.message });
};
```
| Case | Status |
|---|---|
| Missing/invalid fields, malformed ObjectId | 400 |
| Valid ObjectId that does not exist | 404 |
| Created | 201 |
| Unexpected DB error | 500 |

### 4.6 React frontend integration
`client/src/pages/MenuPage.jsx` fetches `GET http://localhost:5001/api/menu` on mount and renders the documents stored in MongoDB. The model's `toJSON` transform exposes `_id` as a string `id`, so cart/menu components work unchanged with ObjectIds. Orders placed at checkout are saved via `POST /api/orders` into the `orders` collection.

### 4.7 JWT authentication and authorization
Write operations are protected with JSON Web Tokens so only authorised users can change database records.

**User model** (`models/User.js`) – passwords are hashed with bcrypt (10 salt rounds) before saving and are never returned in responses.

**Token generation** (`controllers/authController.js`):
```js
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
```
`POST /api/auth/register` creates a customer; `POST /api/auth/login` verifies the password and returns `{ token, user }`. Unknown email and wrong password return the same 401 message.

**Middleware** (`middleware/auth.js`):
```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);   // throws if tampered or expired
req.user = await User.findById(decoded.id);                   // protect
if (req.user.role === 'admin') next(); else 403;              // adminOnly
```
`JWT_SECRET` and the admin credentials live in `.env` (see `.env.example`), never in source.

| Access level | Endpoints |
|---|---|
| Public | `GET /api/menu`, `GET /api/menu/:id`, `GET /api/categories`, `POST /api/auth/register`, `POST /api/auth/login` |
| Guest or logged in | `POST /api/orders` |
| Logged in | `GET /api/auth/me`, `GET /api/orders/my`, `GET /api/orders/:id` (owner or admin) |
| Admin only | `POST/PUT/DELETE /api/menu`, `GET /api/orders`, `PUT/DELETE /api/orders/:id`, `GET /api/auth/users` |

| Case | Status |
|---|---|
| No token / invalid / expired token | 401 |
| Customer token on an admin route | 403 |

### 4.8 Seeding
`npm run seed` (in `server/`) inserts the 12 original dishes into the `menuitems` collection.

---

## 5. Screenshots
*(Hide the password in the connection string / Atlas URL before capturing.)*

**A. MongoDB Configuration**
1. Atlas cluster and `menuitems` collection – `screenshots/exp5-01-atlas-collection.png`
2. Server terminal showing `✅ MongoDB Connected` – `screenshots/exp5-02-db-connected.png`

**B. Postman API Testing** (import `BiteOrder_Postman_Collection.json`; first run *1. Auth → Login (admin)*, which stores the JWT in `{{adminToken}}`; set `adminPassword` in the collection variables. POST/PUT/DELETE on `/api/menu` need the admin Bearer token.)
3. GET all – `GET /api/menu`
4. GET by ID – `GET /api/menu/<ObjectId>`
5. POST – `POST /api/menu` body `{"name":"Tandoori Soya Chaap","category":"starters","price":220}` + admin Bearer token → 201
6. PUT – `PUT /api/menu/<ObjectId>` body `{"price":275}` → 200
7. DELETE – `DELETE /api/menu/<ObjectId>` → 200
8. Invalid request – `POST /api/menu` (admin token) body `{"name":"","category":"pizza","price":-5}` → 400, or `GET /api/menu/abc` → 400
8a. Authentication – `POST /api/auth/login` returning a token; `POST /api/menu` without a token → 401; with a customer token → 403

**C. Frontend**
9. React menu page populated from MongoDB (banner shows `GET /api/menu` connected).

## 6. Conclusion
The BiteOrder API now persists menu items and orders in MongoDB Atlas via Mongoose. Schemas enforce validation, JWT authentication with role-based access protects write operations, all five CRUD operations work with ObjectIds, errors return meaningful 400/404/500 responses, secrets are kept in `.env`, and the React frontend renders live database records.

# Day 16 – Firebase Integration & Real-time Features

The **Staff Hub** (`/firebase`) is a Firebase-powered area added next to the existing Express/JWT app. It does not replace the JWT auth used by the rest of BiteOrder.

## Features
| Requirement | Where |
|---|---|
| Firebase init (Auth, Firestore, Storage) | `client/src/firebase/config.js` |
| Email/password + Google sign-in, sign-out, `onAuthStateChanged` | `client/src/context/FirebaseAuthContext.jsx`, `pages/FirebaseLoginPage.jsx` |
| User profile in Firestore (`users/{uid}`) | `saveProfile()` in the auth context; "Profile" tab |
| Real-time chat (`onSnapshot`, `orderBy`, `limit`) | `Chat` in `pages/FirebaseHubPage.jsx` |
| Collaborative prep list: add / read / update / delete, `where` filter | `Todos` |
| Image upload, download URL, display, delete (Storage) | `Photos` |
| Protected routes | `components/FirebaseProtectedRoute.jsx` |
| Security rules | `firestore.rules`, `storage.rules` |

## Setup
1. Go to https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Sign-in method**: enable **Email/Password** and **Google**.
3. **Build → Firestore Database → Create database** (production mode), then paste `firestore.rules` into the Rules tab and publish.
4. **Build → Storage → Get started**, then paste `storage.rules` into the Rules tab and publish. (Storage may require the Blaze plan on newer projects.)
5. **Project settings → Your apps → Web (`</>`)**: register an app and copy the config.
6. `cd client && cp .env.example .env.local` and fill in the `VITE_FIREBASE_*` values.
7. `npm install && npm run dev`, then open http://localhost:5173/firebase/login.
8. Authentication → Settings → Authorized domains: add your deployed domain.

Equivalent install: `npm install firebase`.

## Data model
- `users/{uid}`: profile (name, email, photoURL, lastLogin)
- `messages/{id}`: chat (text, uid, name, createdAt)
- `prepTasks/{id}`: shared tasks (title, done, by, createdAt)
- `photos/{id}`: metadata for uploads (uid, path, url, name); files live at `photos/{uid}/…` in Storage

## Notes
- The web `apiKey` is not a secret; access is controlled by the security rules. Never commit `.env.local`.
- The `where('done','==',…)` query needs no composite index because it has no `orderBy`.

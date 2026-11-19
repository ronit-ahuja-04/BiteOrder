import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import { firebaseConfigured } from '../firebase/config';

export default function FirebaseLoginPage() {
  const { user, signIn, signUp, googleSignIn } = useFirebaseAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/firebase" replace />;

  const run = async (fn) => {
    setError(''); setBusy(true);
    try { await fn(); } catch (e) { setError(e.code ? e.code.replace('auth/', '').replace(/-/g, ' ') : e.message); }
    finally { setBusy(false); }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); run(() => mode === 'signin' ? signIn(form.email, form.password) : signUp(form.name, form.email, form.password)); }}
        className="w-full max-w-sm bg-white border rounded-2xl p-6 shadow-sm space-y-3"
      >
        <h1 className="text-2xl font-black">Staff Hub · Firebase</h1>
        {!firebaseConfigured && <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">Firebase env vars missing — see docs/FIREBASE_SETUP.md</p>}
        {mode === 'signup' && <input required placeholder="Name" value={form.name} onChange={set('name')} className="w-full border rounded-lg p-2" />}
        <input required type="email" placeholder="Email" value={form.email} onChange={set('email')} className="w-full border rounded-lg p-2" />
        <input required type="password" minLength={6} placeholder="Password (min 6)" value={form.password} onChange={set('password')} className="w-full border rounded-lg p-2" />
        {error && <p className="text-sm text-red-600 capitalize">{error}</p>}
        <button disabled={busy} className="w-full py-2 rounded-lg bg-[#E8590C] text-white font-bold disabled:opacity-60">{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
        <button type="button" disabled={busy} onClick={() => run(googleSignIn)} className="w-full py-2 rounded-lg border font-semibold">Continue with Google</button>
        <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-sm text-slate-600 underline">
          {mode === 'signin' ? 'New here? Create an account' : 'Have an account? Sign in'}
        </button>
        <div><Link to="/" className="text-sm text-slate-500">← Back to menu</Link></div>
      </form>
    </div>
  );
}

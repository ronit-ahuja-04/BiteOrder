import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateLogin } from '../utils/validators';
import PageShell from '../components/PageShell';

const inputCls = (bad) => `mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${bad ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-[#E8590C]/40'}`;

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(location.state?.reason || '');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validateLogin(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;       // stop: show inline errors, no API call
    setBusy(true);
    try {
      const user = await login(form.email.trim(), form.password);
      showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <PageShell title="Login to BiteOrder">
      <form onSubmit={submit} noValidate className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        {error && <div id="auth-error" role="alert" className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>}
        <label className="block text-sm font-semibold text-slate-700">Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls(fieldErrors.email)} placeholder="you@example.com" autoComplete="email" />
          {fieldErrors.email && <span className="text-xs text-red-600 font-normal">{fieldErrors.email}</span>}
        </label>
        <label className="block text-sm font-semibold text-slate-700">Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputCls(fieldErrors.password)} placeholder="••••••••" autoComplete="current-password" />
          {fieldErrors.password && <span className="text-xs text-red-600 font-normal">{fieldErrors.password}</span>}
        </label>
        <button disabled={busy} className="w-full py-2.5 rounded-xl bg-[#E8590C] text-white font-bold hover:bg-orange-700 disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
          {busy ? 'Signing in…' : 'Login'}
        </button>
        <p className="text-sm text-slate-600 text-center">New here? <Link to="/register" className="text-[#E8590C] font-bold">Create an account</Link></p>
      </form>
    </PageShell>
  );
}

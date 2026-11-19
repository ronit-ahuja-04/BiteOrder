import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateRegister } from '../utils/validators';
import PageShell from '../components/PageShell';

const inputCls = (bad) => `mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${bad ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-[#E8590C]/40'}`;

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validateRegister(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      showToast('Account created. Welcome to BiteOrder!');
      navigate('/', { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const field = (key, label, type, ph, auto) => (
    <label className="block text-sm font-semibold text-slate-700">{label}
      <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={inputCls(fieldErrors[key])} placeholder={ph} autoComplete={auto} />
      {fieldErrors[key] && <span className="text-xs text-red-600 font-normal">{fieldErrors[key]}</span>}
    </label>
  );

  return (
    <PageShell title="Create your account">
      <form onSubmit={submit} noValidate className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        {error && <div role="alert" className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>}
        {field('name', 'Full name', 'text', 'Riya Sharma', 'name')}
        {field('email', 'Email', 'email', 'you@example.com', 'email')}
        {field('password', 'Password (min 6 characters)', 'password', '••••••••', 'new-password')}
        <button disabled={busy} className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-700 disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
          {busy ? 'Creating…' : 'Register'}
        </button>
        <p className="text-sm text-slate-600 text-center">Already registered? <Link to="/login" className="text-[#E8590C] font-bold">Login</Link></p>
      </form>
    </PageShell>
  );
}

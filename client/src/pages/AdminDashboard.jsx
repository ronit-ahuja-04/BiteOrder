import React, { useState } from 'react';
import { getToken } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import { API_BASE as BASE } from '../config';
import useFetch from '../hooks/useFetch';
import PageShell from '../components/PageShell';
import Spinner from '../components/Spinner';

const write = (path, method, body) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${getToken()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());

const CATEGORIES = ['starters', 'mains', 'breads', 'desserts', 'beverages'];

export default function AdminDashboard() {
  const { menuVersion } = useNotifications();   // bumps on every live menu notification -> menu list refetches
  const { showToast } = useToast();
  const users = useFetch('/auth/users', { auth: true });
  const orders = useFetch('/orders', { auth: true });
  const menu = useFetch('/menu', { deps: [menuVersion] });
  const [form, setForm] = useState({ name: '', category: 'starters', price: '' });

  const userList = users.data?.data || [];
  const orderList = orders.data?.data || [];
  const menuList = menu.data?.data || [];

  const report = (d, okMsg) => showToast(d.success ? okMsg : d.message, d.success ? 'success' : 'error');
  const addItem = async (e) => {
    e.preventDefault();
    const d = await write('/menu', 'POST', { name: form.name, category: form.category, price: Number(form.price) });
    report(d, `Created "${d.data?.name}"`);
    if (d.success) setForm({ name: '', category: 'starters', price: '' });
  };
  const editPrice = async (item) => {
    const v = window.prompt(`New price for ${item.name} (₹)`, item.price);
    if (v === null) return;
    report(await write(`/menu/${item._id}`, 'PUT', { price: Number(v) }), `Updated "${item.name}"`);
  };
  const removeItem = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    report(await write(`/menu/${item._id}`, 'DELETE'), `Deleted "${item.name}"`);
  };

  const th = 'p-3 text-left text-xs uppercase text-slate-600';
  const input = 'px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C]/40';
  return (
    <PageShell title="Admin Dashboard" wide>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[['Registered users', userList.length], ['Admins', userList.filter((u) => u.role === 'admin').length], ['Orders', orderList.length], ['Menu items', menuList.length]].map(([l, v]) => (
          <div key={l} className="bg-white border border-slate-200 rounded-2xl p-5"><div className="text-xs uppercase text-slate-500 font-bold">{l}</div><div className="text-3xl font-black text-slate-900">{v}</div></div>
        ))}
      </div>

      <h2 className="font-bold text-slate-900 mb-2">Manage menu <span className="text-xs font-normal text-slate-500">– every change is broadcast live to all connected users</span></h2>
      <form onSubmit={addItem} className="bg-white border border-slate-200 rounded-2xl p-4 mb-3 flex flex-wrap gap-3 items-end">
        <label className="text-xs font-semibold text-slate-600">Dish name<br /><input required className={`${input} w-full sm:w-56`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tandoori Soya Chaap" /></label>
        <label className="text-xs font-semibold text-slate-600">Category<br /><select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-xs font-semibold text-slate-600">Price (₹)<br /><input required type="number" min="1" className={`${input} w-28`} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="220" /></label>
        <button className="px-4 py-2 rounded-lg bg-[#E8590C] text-white font-bold text-sm hover:bg-orange-700 transition-colors cursor-pointer">+ Add dish</button>
      </form>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8 max-h-72 overflow-y-auto overflow-x-auto">
        {menu.loading && !menu.data ? <Spinner /> : menu.error ? <p className="p-4 text-sm text-red-600">{menu.error}</p> : (
          <table className="w-full text-sm"><thead className="bg-slate-100 sticky top-0"><tr><th className={th}>Dish</th><th className={th}>Category</th><th className={th}>Price</th><th className={th}>Actions</th></tr></thead>
            <tbody>{menuList.map((m) => (<tr key={m._id} className="border-t"><td className="p-3">{m.name}</td><td className="p-3 capitalize">{m.category}</td><td className="p-3">₹{m.price}</td>
              <td className="p-3 space-x-2 whitespace-nowrap"><button onClick={() => editPrice(m)} className="px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">Edit price</button><button onClick={() => removeItem(m)} className="px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer">Delete</button></td></tr>))}</tbody></table>
        )}
      </div>

      <h2 className="font-bold text-slate-900 mb-2">Users (GET /api/auth/users – admin only)</h2>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto mb-8">
        {users.loading ? <Spinner /> : users.error ? <p className="p-4 text-sm text-red-600">{users.error}</p> : (
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Joined</th></tr></thead>
            <tbody>{userList.map((u) => (<tr key={u._id} className="border-t"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td>
              <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>{u.role}</span></td>
              <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td></tr>))}</tbody></table>
        )}
      </div>

      <h2 className="font-bold text-slate-900 mb-2">All orders (GET /api/orders – admin only)</h2>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
        {orders.loading ? <Spinner /> : orders.error ? <p className="p-4 text-sm text-red-600">{orders.error}</p> : orderList.length === 0 ? <p className="p-6 text-slate-500 text-sm">No orders yet.</p> : (
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Account</th><th className={th}>Total</th><th className={th}>Status</th></tr></thead>
            <tbody>{orderList.map((o) => (<tr key={o._id} className="border-t"><td className="p-3 font-mono">{o.orderId}</td><td className="p-3">{o.customer?.name}</td><td className="p-3 text-slate-500">{o.user ? o.user.email : 'guest'}</td><td className="p-3">₹{o.total}</td><td className="p-3">{o.status}</td></tr>))}</tbody></table>
        )}
      </div>
    </PageShell>
  );
}

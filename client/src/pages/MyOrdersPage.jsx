import React, { useState } from 'react';
import { getToken, useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';
import useFetch from '../hooks/useFetch';
import PageShell from '../components/PageShell';
import Spinner from '../components/Spinner';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch('/orders/my', { auth: true });
  const orders = data?.data || [];
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');

  // GET /api/orders/:orderId – the "view order details" request (server checks ownership)
  const viewOrder = async (orderId) => {
    setDetail(null); setDetailError('');
    const res = await fetch(`${API_BASE}/orders/${orderId}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const d = await res.json();
    if (res.ok) setDetail(d.data); else setDetailError(d.message || 'Could not load order');
  };

  return (
    <PageShell title={`My Orders – ${user.name}`} wide>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
        {loading ? <Spinner /> : error ? <p className="p-6 text-sm text-red-600">{error}</p> : orders.length === 0 ? (
          <p className="p-8 text-center text-slate-500">You have not placed any orders yet.</p>
        ) : (
          <table className="w-full text-sm"><thead className="bg-slate-100 text-left text-xs uppercase text-slate-600"><tr><th className="p-3">Order</th><th className="p-3">Table</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
            <tbody>{orders.map((o) => (<tr key={o._id} className="border-t"><td className="p-3 font-mono">{o.orderId}</td><td className="p-3">{o.tableNumber}</td><td className="p-3">{o.items.length}</td><td className="p-3">₹{o.total}</td><td className="p-3">{o.status}</td>
              <td className="p-3"><button onClick={() => viewOrder(o.orderId)} className="px-2.5 py-1 rounded-md border border-slate-300 bg-slate-50 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer">View details</button></td></tr>))}</tbody></table>
        )}
      </div>

      {detailError && <p id="order-error" role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{detailError}</p>}
      {detail && (
        <div id="order-detail" className="mt-4 bg-white border border-slate-200 rounded-2xl p-5 text-sm">
          <h2 className="font-bold text-slate-900 mb-2">Order {detail.orderId}</h2>
          <p>Customer: <b>{detail.customer?.name}</b> · Mobile: <b>{detail.customer?.mobile}</b></p>
          <p>Table {detail.tableNumber} · {detail.orderType} · Status: {detail.status}</p>
          <ul className="list-disc ml-5 mt-2">{detail.items.map((i, n) => <li key={n}>{i.name} × {i.quantity || 1}</li>)}</ul>
          <p className="mt-2 font-bold">Total ₹{detail.total}</p>
        </div>
      )}
    </PageShell>
  );
}

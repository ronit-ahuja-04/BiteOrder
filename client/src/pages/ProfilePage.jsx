import React from 'react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import PageShell from '../components/PageShell';
import Spinner from '../components/Spinner';

// Shows the logged-in user's own profile: GET /api/profiles/:id (id = the user's MongoDB id)
export default function ProfilePage() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(`/profiles/${user._id}`, { auth: true });
  const p = data?.profile;

  return (
    <PageShell title="My Profile">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {loading ? <Spinner /> : error ? <p role="alert" className="text-sm text-red-700">{error}</p> : (
          <dl className="grid grid-cols-3 gap-y-3 text-sm">
            <dt className="text-slate-500 font-semibold">Name</dt><dd className="col-span-2 font-bold text-slate-900">{p.name}</dd>
            <dt className="text-slate-500 font-semibold">Email</dt><dd className="col-span-2">{p.email}</dd>
            <dt className="text-slate-500 font-semibold">Role</dt><dd className="col-span-2 capitalize">{p.role}</dd>
            <dt className="text-slate-500 font-semibold">Profile ID</dt><dd className="col-span-2 font-mono text-xs break-all">{p._id}</dd>
            <dt className="text-slate-500 font-semibold">Member since</dt><dd className="col-span-2">{new Date(p.createdAt).toLocaleDateString()}</dd>
          </dl>
        )}
      </div>
    </PageShell>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, limit,
  where, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';

// ---- Real-time chat: onSnapshot + orderBy + limit ----
function Chat({ user }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const end = useRef(null);
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (s) => setMsgs(s.docs.map((d) => ({ id: d.id, ...d.data() })).reverse()));
  }, []);
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [msgs]);
  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, 'messages'), { text: text.trim(), uid: user.uid, name: user.displayName || user.email, createdAt: serverTimestamp() });
    setText('');
  };
  return (
    <div>
      <div className="h-80 overflow-y-auto border rounded-xl p-3 bg-white space-y-2">
        {msgs.map((m) => (
          <div key={m.id} className={m.uid === user.uid ? 'text-right' : ''}>
            <span className="text-xs text-slate-500">{m.name}</span>
            <div className={`inline-block px-3 py-1.5 rounded-xl ml-2 ${m.uid === user.uid ? 'bg-[#E8590C] text-white' : 'bg-slate-100'}`}>{m.text}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 mt-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message the team…" className="flex-1 border rounded-lg p-2" />
        <button className="px-4 rounded-lg bg-[#E8590C] text-white font-bold">Send</button>
      </form>
    </div>
  );
}

// ---- Collaborative prep list: full CRUD + where() query + real-time ----
function Todos({ user }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    const col = collection(db, 'prepTasks');
    const q = filter === 'all' ? query(col, orderBy('createdAt', 'desc'))
      : query(col, where('done', '==', filter === 'done'));
    return onSnapshot(q, (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [filter]);
  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, 'prepTasks'), { title: text.trim(), done: false, by: user.displayName || user.email, createdAt: serverTimestamp() });
    setText('');
  };
  return (
    <div>
      <form onSubmit={add} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New prep task…" className="flex-1 border rounded-lg p-2" />
        <button className="px-4 rounded-lg bg-[#E8590C] text-white font-bold">Add</button>
      </form>
      <div className="flex gap-2 my-3 text-sm">
        {['all', 'open', 'done'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full border ${filter === f ? 'bg-slate-900 text-white' : ''}`}>{f}</button>
        ))}
      </div>
      <ul className="space-y-2">
        {items.map((t) => (
          <li key={t.id} className="flex items-center gap-3 bg-white border rounded-lg p-2">
            <input type="checkbox" checked={t.done} onChange={() => updateDoc(doc(db, 'prepTasks', t.id), { done: !t.done })} />
            <span className={`flex-1 ${t.done ? 'line-through text-slate-400' : ''}`}>{t.title} <em className="text-xs text-slate-400">· {t.by}</em></span>
            <button onClick={() => deleteDoc(doc(db, 'prepTasks', t.id))} className="text-red-500 text-sm">Delete</button>
          </li>
        ))}
        {!items.length && <li className="text-slate-400 text-sm">Nothing here yet.</li>}
      </ul>
    </div>
  );
}

// ---- Storage: upload, download URL, display, delete ----
function Photos({ user }) {
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const q = query(collection(db, 'photos'), where('uid', '==', user.uid));
    return onSnapshot(q, (s) => setPhotos(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [user.uid]);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) { setError('Choose an image under 5 MB.'); return; }
    setError(''); setBusy(true);
    try {
      const path = `photos/${user.uid}/${Date.now()}_${file.name}`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await addDoc(collection(db, 'photos'), { uid: user.uid, path, url, name: file.name, createdAt: serverTimestamp() });
    } catch (err) { setError(err.message); } finally { setBusy(false); e.target.value = ''; }
  };
  const remove = async (p) => {
    await deleteObject(ref(storage, p.path));
    await deleteDoc(doc(db, 'photos', p.id));
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={upload} disabled={busy} />
      {busy && <p className="text-sm text-slate-500">Uploading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {photos.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg overflow-hidden">
            <img src={p.url} alt={p.name} className="h-32 w-full object-cover" />
            <button onClick={() => remove(p)} className="w-full text-red-500 text-sm py-1">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  useEffect(() => onSnapshot(doc(db, 'users', user.uid), (s) => setProfile(s.data())), [user.uid]);
  return (
    <pre className="bg-white border rounded-xl p-4 text-sm overflow-auto">
      {JSON.stringify(profile ? { ...profile, lastLogin: profile.lastLogin?.toDate?.().toISOString(), createdAt: profile.createdAt?.toDate?.().toISOString() } : 'Loading…', null, 2)}
    </pre>
  );
}

const TABS = { Chat, 'Prep list': Todos, Photos, Profile };

export default function FirebaseHubPage() {
  const { user, logout } = useFirebaseAuth();
  const [tab, setTab] = useState('Chat');
  const Active = TABS[tab];
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <h1 className="font-black text-lg">Staff Hub <span className="text-slate-400 font-normal text-sm">· {user.displayName || user.email}</span></h1>
        <div className="flex gap-4 text-sm"><Link to="/">Menu</Link><button onClick={logout} className="font-semibold">Sign out</button></div>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <nav className="flex gap-2 mb-4">
          {Object.keys(TABS).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${tab === t ? 'bg-[#E8590C] text-white border-[#E8590C]' : 'bg-white'}`}>{t}</button>
          ))}
        </nav>
        <Active user={user} />
      </main>
    </div>
  );
}

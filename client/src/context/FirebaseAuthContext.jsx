import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';

const Ctx = createContext(null);

// Create/refresh the user's profile document in Firestore: users/{uid}
const saveProfile = (u, extra = {}) =>
  setDoc(doc(db, 'users', u.uid), {
    uid: u.uid, email: u.email, displayName: u.displayName || extra.displayName || '',
    photoURL: u.photoURL || '', lastLogin: serverTimestamp(), ...extra,
  }, { merge: true });

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); }), []);

  const signUp = async (name, email, password) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(u, { displayName: name });
    await saveProfile(u, { displayName: name, createdAt: serverTimestamp() });
    setUser({ ...u });
    return u;
  };
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const googleSignIn = async () => {
    const { user: u } = await signInWithPopup(auth, googleProvider);
    await saveProfile(u);
    return u;
  };
  const logout = () => signOut(auth);

  return <Ctx.Provider value={{ user, loading, signUp, signIn, googleSignIn, logout }}>{children}</Ctx.Provider>;
}

export const useFirebaseAuth = () => useContext(Ctx);

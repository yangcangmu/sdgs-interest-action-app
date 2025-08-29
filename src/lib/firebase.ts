// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ブラウザ実行時のみ、かつ環境変数が有効な場合にエミュレータへ接続
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
  try {
    const host = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || '127.0.0.1';
    const port = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || 8081);
    connectFirestoreEmulator(db, host, port);
  } catch {
    // すでに接続済みの場合などは無視
  }
}

// Auth エミュレータ接続
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true') {
  try {
    const host = process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST || '127.0.0.1';
    const port = Number(process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT || 9099);
    connectAuthEmulator(auth, `http://${host}:${port}`);
  } catch {
    // すでに接続済みの場合などは無視
  }
}

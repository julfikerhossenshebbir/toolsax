// This is a placeholder for Firebase configuration.
// To enable Firebase features, you need to set up a Firebase project and
// add your configuration here.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, runTransaction, onValue, type Database } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: "AIzaSyCjlDeMVCox4fujNWO2nzku-EiAsOUWX9s",
  authDomain: "hand-gram.firebaseapp.com",
  databaseURL: "https://hand-gram-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hand-gram",
  storageBucket: "hand-gram.appspot.com",
  messagingSenderId: "21742056984",
  appId: "1:21742056984:web:206e8d9c8b858498d8756d"
};

let app: FirebaseApp | undefined;
let db: Database | undefined;

//
// NOTE: The Firebase functionality has been temporarily disabled due to a
// "permission_denied" error. To re-enable it, you must configure your
// Firebase Realtime Database security rules to allow public read/write access.
//
// You can do this by visiting your Firebase project console, navigating to
// the Realtime Database section, and updating the rules to:
//
// {
//   "rules": {
//     ".read": "true",
//     ".write": "true"
//   }
// }
//
// After updating the rules, change the value of `isFirebaseEnabled` below to `true`.
//
const isFirebaseEnabled = false;


// Check if all necessary config values are present
const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId;

if (isFirebaseConfigured && isFirebaseEnabled && getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// --- User Management ---

const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('toolsax_user_id');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('toolsax_user_id', userId);
  }
  return userId;
};

// --- Database Functions ---

const incrementCounter = (path: string) => {
  if (!db) return;
  const counterRef = ref(db, path);
  runTransaction(counterRef, (currentValue) => (currentValue || 0) + 1);
};

export const incrementViews = () => {
  if (!isFirebaseConfigured || !isFirebaseEnabled) return;
  incrementCounter('stats/views');
};

export const incrementClicks = (toolId: string) => {
  if (!db) return;
  incrementCounter('stats/tool_clicks');
  incrementCounter(`tools/${toolId}/clicks`);
};


export const initializeUser = () => {
    if (!db || typeof window === 'undefined') return;

    const userId = getUserId();
    const userRef = ref(db, `users/${userId}`);

    runTransaction(userRef, (userData) => {
        if (userData === null) {
            incrementCounter('stats/users');
            return { createdAt: new Date().toISOString() };
        }
        return userData; // User already exists
    });
};

export const getStats = (callback: (stats: { views: number; tool_clicks: number; users: number }) => void) => {
  if (!db) {
    // Provide fallback data if Firebase is not configured
    callback({ views: 0, tool_clicks: 0, users: 0 });
    return () => {}; // Return an empty unsubscribe function
  }

  const statsRef = ref(db, 'stats');
  const unsubscribe = onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || { views: 0, tool_clicks: 0, users: 0 };
    callback(data);
  });

  return unsubscribe;
};

export const isConfigured = isFirebaseConfigured && isFirebaseEnabled;

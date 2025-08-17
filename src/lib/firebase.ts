// This is a placeholder for Firebase configuration.
// To enable Firebase features, you need to set up a Firebase project and
// add your configuration here.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, runTransaction, onValue, get, type Database } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
    message: string;
    icon: string;
}

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

const isFirebaseEnabled = true;


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
    callback({ views: 0, tool_clicks: 0, users: 0 });
    return () => {};
  }

  const statsRef = ref(db, 'stats');
  const unsubscribe = onValue(statsRef, (snapshot) => {
    const data = snapshot.val() || { views: 0, tool_clicks: 0, users: 0 };
    callback(data);
  });

  return unsubscribe;
};

export const getToolStats = (toolId: string, callback: (stats: { clicks: number }) => void) => {
  if (!db) {
    callback({ clicks: 0 });
    return () => {};
  }

  const toolStatsRef = ref(db, `tools/${toolId}`);
  const unsubscribe = onValue(toolStatsRef, (snapshot) => {
    const data = snapshot.val() || { clicks: 0 };
    callback(data);
  });

  return unsubscribe;
};

export const getNotificationMessage = (callback: (messages: Notification[]) => void) => {
  const defaultMessages: Notification[] = [
    { message: "New tool added: PDF Merger!", icon: "FilePlus" },
    { message: "Dark mode is now available.", icon: "Moon" },
    { message: "Customize your theme in settings.", icon: "Settings" },
  ];
  
  if (!db) {
    callback(defaultMessages);
    return () => {};
  }

  const notificationRef = ref(db, 'notif');
  const unsubscribe = onValue(notificationRef, (snapshot) => {
    const messages = snapshot.val();
    callback(Array.isArray(messages) && messages.length > 0 ? messages : defaultMessages);
  }, (error) => {
      console.error("Error fetching notification: ", error);
      callback(defaultMessages)
  });

  return unsubscribe;
}


export const isConfigured = isFirebaseConfigured && isFirebaseEnabled;

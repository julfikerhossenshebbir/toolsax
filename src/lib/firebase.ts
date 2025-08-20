
// This is a placeholder for Firebase configuration.
// To enable Firebase features, you need to set up a Firebase project and
// add your configuration here.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, runTransaction, onValue, get, set, type Database, serverTimestamp, push, child } from "firebase/database";
import { 
    getAuth, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type Auth,
    type User
} from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
    message: string;
    icon: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyCGyVqbVZhp9rqEQYZ_vrcUYCXXk-6p37w",
  authDomain: "toolsaxdb.firebaseapp.com",
  databaseURL: "https://toolsaxdb-default-rtdb.firebaseio.com",
  projectId: "toolsaxdb",
  storageBucket: "toolsaxdb.firebasestorage.app",
  messagingSenderId: "521841849034",
  appId: "1:521841849034:web:5be88041b20b3d6435fa33",
  measurementId: "G-J0SGP2CFQH"
};

let app: FirebaseApp | undefined;
let db: Database | undefined;
let auth: Auth | undefined;

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
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// --- Auth Functions ---
const googleProvider = auth ? new GoogleAuthProvider() : undefined;

export const signInWithGoogle = () => {
    if (!auth || !googleProvider) throw new Error("Firebase not configured for Google Sign-In.");
    return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmail = (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured for Email Sign-Up.");
    return createUserWithEmailAndPassword(auth, email, pass);
};

export const signInWithEmail = (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured for Email Sign-In.");
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logout = () => {
    if (!auth) throw new Error("Firebase not configured for Sign-Out.");
    return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
};

export const updateUserProfile = (user: User, profile: { displayName?: string, photoURL?: string }) => {
    if (db) {
        const userRef = ref(db, `users/${user.uid}`);
        runTransaction(userRef, (userData) => {
            if(userData) {
                if(profile.displayName) userData.name = profile.displayName;
                if(profile.photoURL) userData.photoURL = profile.photoURL;
            }
            return userData;
        })
    }
    return updateProfile(user, profile);
};


// --- User Management & Database Functions ---
const getAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('toolsax_anonymous_user_id');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('toolsax_anonymous_user_id', userId);
  }
  return userId;
};

export const initializeUser = () => {
    if (!db || typeof window === 'undefined') return;

    const userId = getAnonymousUserId();
    const userRef = ref(db, `anonymous_users/${userId}`);

    runTransaction(userRef, (userData) => {
        if (userData === null) {
            incrementCounter('stats/users'); // counts both anonymous and registered
            return { createdAt: new Date().toISOString() };
        }
        return userData;
    });
};

export const saveUserToDatabase = async (uid: string, data: { name?: string | null, username?: string, email?: string | null }) => {
    if (!db) return;
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
        // Only set initial data if user is new
        return set(userRef, {
            name: data.name || 'Anonymous',
            username: data.username || '',
            email: data.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        });
    } else {
        // Update last login for existing users
         return runTransaction(userRef, (userData) => {
            if (userData) {
                userData.lastLogin = serverTimestamp();
            }
            return userData;
        });
    }
};

export const saveSearchQuery = (userId: string, query: string) => {
    if(!db) return;
    const searchHistoryRef = ref(db, `users/${userId}/searchHistory`);
    const newSearchRef = push(searchHistoryRef);
    set(newSearchRef, {
        query: query,
        timestamp: serverTimestamp()
    });
};

// --- General Database Functions ---
const incrementCounter = (path: string) => {
  if (!db) return;
  const counterRef = ref(db, path);
  runTransaction(counterRef, (currentValue) => (currentValue || 0) + 1);
};

export const incrementViews = () => {
  if (!isConfigured || !isFirebaseEnabled) return;
  incrementCounter('stats/views');
};

export const incrementClicks = (toolId: string) => {
  if (!db) return;
  incrementCounter('stats/tool_clicks');
  incrementCounter(`tools/${toolId}/clicks`);
};

export const toggleFavoriteInDb = async (userId: string, toolId: string): Promise<boolean> => {
    if (!db) return false;
    const favoritesRef = ref(db, `users/${userId}/favorites`);
    const snapshot = await get(favoritesRef);
    const favorites = snapshot.val() || [];
    const newIsFavorite = !favorites.includes(toolId);

    let newFavorites;
    if (newIsFavorite) {
        newFavorites = [...favorites, toolId];
    } else {
        newFavorites = favorites.filter((id: string) => id !== toolId);
    }
    await set(favoritesRef, newFavorites);
    return newIsFavorite;
};

export const getUserFavorites = (userId: string, callback: (favorites: string[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const favoritesRef = ref(db, `users/${userId}/favorites`);
    return onValue(favoritesRef, (snapshot) => {
        callback(snapshot.val() || []);
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

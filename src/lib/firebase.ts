
// This is a placeholder for Firebase configuration.
// To enable Firebase features, you need to set up a Firebase project and
// add your configuration here.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, runTransaction, onValue, get, set, type Database, serverTimestamp, push, child, update, remove, query, orderByChild, equalTo, limitToLast, orderByValue } from "firebase/database";
import { 
    getAuth, 
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type Auth,
    type User
} from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import type { AdSettings, Advertisement, Comment, Reply, Tool, SubmittedAd } from "@/app/admin/types";
import { ALL_TOOLS as STATIC_TOOLS } from "./tools";
import { subMonths, format, startOfMonth } from 'date-fns';


export interface Notification {
    message: string;
    icon: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyCGyVqbVZhp9rqEQYZ_vrcUYCXXk-6p37w",
  authDomain: "toolsaxdb.firebaseapp.com",
  databaseURL: "https://toolsaxdb-default-rtdb.firebaseio.com",
  projectId: "toolsaxdb",
  storageBucket: "toolsaxdb.appspot.com",
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
const githubProvider = auth ? new GithubAuthProvider() : undefined;
const facebookProvider = auth ? new FacebookAuthProvider() : undefined;


export const signInWithGoogle = () => {
    if (!auth || !googleProvider) throw new Error("Firebase not configured for Google Sign-In.");
    return signInWithPopup(auth, googleProvider);
};

export const signInWithGithub = () => {
    if (!auth || !githubProvider) throw new Error("Firebase not configured for GitHub Sign-In.");
    return signInWithPopup(auth, githubProvider);
};

export const signInWithFacebook = () => {
    if (!auth || !facebookProvider) throw new Error("Firebase not configured for Facebook Sign-In.");
    return signInWithPopup(auth, facebookProvider);
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

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
    if (!db) return false;
    const usernameRef = ref(db, `usernames/${username.toLowerCase()}`);
    const snapshot = await get(usernameRef);
    return !snapshot.exists();
}

export const getUidByUsername = async (username: string): Promise<string | null> => {
    if (!db) return null;
    const usernameRef = ref(db, `usernames/${username.toLowerCase()}`);
    const snapshot = await get(usernameRef);
    return snapshot.val() || null;
};

export const getUserPublicProfile = async (username: string) => {
    const uid = await getUidByUsername(username);
    if (!uid) return null;
    const data = await getUserData(uid);
    if (!data) return null;
    return {
        uid: uid,
        name: data.name,
        username: data.username,
        photoURL: data.photoURL,
        lastLogin: data.lastLogin,
        favorites: data.favorites || [],
        bio: data.bio,
        social: data.social,
    };
};

export const checkAndCreateUser = async (data: { 
    name: string, 
    username: string, 
    email: string, 
    password?: string, // Password is optional for social sign-up
    uid?: string, // UID is present for social sign-up
    isSocial?: boolean, // Flag for social sign up
    photoURL?: string,
    phone?: string,
    dob?: Date, 
    country?: string 
}) => {
    if (!auth || !db) throw new Error("Firebase not configured.");
    
    const usernameAvailable = await isUsernameAvailable(data.username);
    if (!usernameAvailable) {
        throw new Error(`Username '${data.username}' is already taken. Please choose another one.`);
    }

    let user: User;
    if (data.isSocial && data.uid) {
        // This is a social sign-up, user already exists in auth
        const existingUser = auth.currentUser;
        if (!existingUser || existingUser.uid !== data.uid) {
            throw new Error("Mismatched user session. Please try signing in again.");
        }
        user = existingUser;
    } else if (data.password) {
        // This is an email sign-up
        const userCredential = await signUpWithEmail(data.email, data.password);
        user = userCredential.user;
    } else {
        throw new Error("Invalid sign-up data. Password or social provider info is missing.");
    }

    await updateProfile(user, { displayName: data.name, photoURL: data.photoURL });

    const userRef = ref(db, `users/${user.uid}`);
    
    const userData: any = {
        name: data.name,
        username: data.username.toLowerCase(),
        email: data.email,
        photoURL: data.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'user', // Default role
    };

    if (data.phone) userData.contactNumber = data.phone;
    if (data.dob) userData.dob = format(data.dob, 'yyyy-MM-dd');
    if (data.country) userData.country = data.country;
    
    await set(userRef, userData);

    const usernameRef = ref(db, `usernames/${data.username.toLowerCase()}`);
    await set(usernameRef, user.uid);
};


export const saveUserToDatabase = async (user: User) => {
    if (!db) return;
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
        incrementCounter('stats/users');
        await set(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: 'user'
        });
    } else {
        await update(userRef, {
            lastLogin: serverTimestamp(),
            name: user.displayName,
            photoURL: user.photoURL,
        });
    }
};

export const getUserData = async (uid: string) => {
    if (!db) return null;
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.val();
};

export const subscribeToAllUsers = (callback: (users: any[]) => void) => {
    if (!db) {
        callback([]);
        return () => {}; // Return an empty unsubscribe function
    }
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersList = Object.keys(usersData).map(uid => ({
                uid,
                ...usersData[uid]
            }));
            callback(usersList);
        } else {
            callback([]);
        }
    });

    return unsubscribe; // Return the unsubscribe function from onValue
};


export const updateUserData = (uid: string, data: object) => {
    if (!db) return;
    const userRef = ref(db, `users/${uid}`);
    return update(userRef, data);
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

export const saveUserThemeSettings = (uid: string, settings: object) => {
    if (!db) return;
    const themeRef = ref(db, `users/${uid}/themeSettings`);
    return update(themeRef, settings);
};

export const getUserThemeSettings = async (uid: string) => {
    if (!db) return null;
    const themeRef = ref(db, `users/${uid}/themeSettings`);
    const snapshot = await get(themeRef);
    return snapshot.val();
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
  incrementCounter(`tool_stats/${toolId}/clicks`);
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

export const getStats = (subscribe: boolean = true, callback?: (stats: { views: number; tool_clicks: number; users: number }) => void) => {
  if (!db) {
    if(callback) callback({ views: 0, tool_clicks: 0, users: 0 });
    return () => {};
  }
  
  const statsRef = ref(db, 'stats');
  
  if (subscribe && callback) {
      const unsubscribe = onValue(statsRef, (snapshot) => {
        const data = snapshot.val() || { views: 0, tool_clicks: 0, users: 0 };
        callback(data);
      });
      return unsubscribe;
  } else {
      return get(statsRef).then(snapshot => snapshot.val() || { views: 0, tool_clicks: 0, users: 0 });
  }
};


export const getToolStats = (toolId: string, callback: (stats: { clicks: number }) => void) => {
  if (!db) {
    callback({ clicks: 0 });
    return () => {};
  }

  const toolStatsRef = ref(db, `tool_stats/${toolId}`);
  const unsubscribe = onValue(toolStatsRef, (snapshot) => {
    const data = snapshot.val() || { clicks: 0 };
    callback(data);
  });

  return unsubscribe;
};

export const getNotificationMessage = (subscribe: boolean = true, callback?: (messages: Notification[]) => void) => {
  const defaultMessages: Notification[] = [
    { message: "New tool added: PDF Merger!", icon: "FilePlus" },
    { message: "Dark mode is now available.", icon: "Moon" },
    { message: "Customize your theme in settings.", icon: "Settings" },
  ];
  
  if (!db) {
    if(callback) callback(defaultMessages);
    return () => {};
  }

  const notificationRef = ref(db, 'notif');

  if(subscribe && callback) {
    const unsubscribe = onValue(notificationRef, (snapshot) => {
        const messages = snapshot.val();
        callback(Array.isArray(messages) && messages.length > 0 ? messages : defaultMessages);
    }, (error) => {
        console.error("Error fetching notification: ", error);
        callback(defaultMessages)
    });
    return unsubscribe;
  } else {
     return get(notificationRef).then(snapshot => {
        const messages = snapshot.val();
        return Array.isArray(messages) && messages.length > 0 ? messages : defaultMessages;
     });
  }
}

export const updateGlobalNotifications = (notifications: Notification[]) => {
    if (!db) throw new Error("Firebase not configured.");
    const notificationRef = ref(db, 'notif');
    return set(notificationRef, notifications);
};

// --- Ad Settings ---
export const getAdSettings = (subscribe: boolean = true, callback?: (settings: AdSettings) => void) => {
    if (!db) {
        if (callback) callback({ adsEnabled: false, viewLimit: 3, cooldownMinutes: 30 });
        return () => {};
    }
    const adSettingsRef = ref(db, 'settings/ads');

    if (subscribe && callback) {
        const unsubscribe = onValue(adSettingsRef, (snapshot) => {
            callback(snapshot.val());
        });
        return unsubscribe;
    } else {
        return get(adSettingsRef).then(snapshot => snapshot.val());
    }
}

export const updateAdSettings = (settings: AdSettings) => {
    if (!db) throw new Error("Firebase not configured.");
    const adSettingsRef = ref(db, 'settings/ads');
    return set(adSettingsRef, settings);
}

// --- Advertisement CRUD ---
export const getAllAdvertisements = (subscribe: boolean = true, callback: (ads: Advertisement[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const adsRef = ref(db, 'advertisements');
    const unsubscribe = onValue(adsRef, (snapshot) => {
        if (snapshot.exists()) {
            const adsData = snapshot.val();
            const adsList = Object.keys(adsData).map(id => ({
                id,
                ...adsData[id]
            }));
            callback(adsList);
        } else {
            callback([]);
        }
    });
    return unsubscribe;
};

export const getSeenAds = async (userId?: string): Promise<string[]> => {
    if (!db) return [];
    if (userId) {
        const seenAdsRef = ref(db, `users/${userId}/seenAds`);
        const snapshot = await get(seenAdsRef);
        return snapshot.val() || [];
    } else {
        const seenAdsJson = localStorage.getItem('seen_ads');
        return seenAdsJson ? JSON.parse(seenAdsJson) : [];
    }
};

export const markAdAsSeen = (userId?: string, adId?: string) => {
    if (!adId) return;
    if (userId && db) {
        const seenAdsRef = ref(db, `users/${userId}/seenAds`);
        runTransaction(seenAdsRef, (seenAds) => {
            if (!seenAds) seenAds = [];
            if (!seenAds.includes(adId)) {
                seenAds.push(adId);
            }
            return seenAds;
        });
    } else {
        const seenAds = JSON.parse(localStorage.getItem('seen_ads') || '[]');
        if (!seenAds.includes(adId)) {
            seenAds.push(adId);
            localStorage.setItem('seen_ads', JSON.stringify(seenAds));
        }
    }
};


export const getActiveAdvertisement = async (seenAdIds: string[] = []): Promise<Advertisement | null> => {
    if (!db) return null;
    const adsRef = ref(db, 'advertisements');
    const snapshot = await get(adsRef);
    if (!snapshot.exists()) return null;

    const adsData = snapshot.val();
    const activeAds = Object.values(adsData).filter((ad: any) => {
        if (!ad.isActive || seenAdIds.includes(ad.id)) return false;
        
        const maxViews = ad.maxViews || Infinity;
        const maxClicks = ad.maxClicks || Infinity;
        const currentViews = ad.currentViews || 0;
        const currentClicks = ad.currentClicks || 0;
        
        // Use 0 as a default for currentViews/currentClicks if they are undefined
        return currentViews < maxViews && currentClicks < maxClicks;
    }) as Advertisement[];

    if (activeAds.length === 0) return null;

    // Pick a random active ad to display
    const randomIndex = Math.floor(Math.random() * activeAds.length);
    return activeAds[randomIndex];
};

export const incrementAdViews = (adId: string) => {
    if (!db) return;
    const adRef = ref(db, `advertisements/${adId}`);
    runTransaction(adRef, (ad) => {
        if (ad) {
            ad.currentViews = (ad.currentViews || 0) + 1;
            
            // Also update the submitted ad for user dashboard
            if (ad.submittedAdId) {
                const submittedAdRef = ref(db, `submittedAds/${ad.submittedAdId}/currentViews`);
                runTransaction(submittedAdRef, (currentViews) => (currentViews || 0) + 1);
            }
        }
        return ad;
    });
};

export const incrementAdClicks = (adId: string) => {
    if (!db) return;
    const adRef = ref(db, `advertisements/${adId}`);
    runTransaction(adRef, (ad) => {
        if (ad) {
            ad.currentClicks = (ad.currentClicks || 0) + 1;

            // Also update the submitted ad for user dashboard
            if (ad.submittedAdId) {
                const submittedAdRef = ref(db, `submittedAds/${ad.submittedAdId}/currentClicks`);
                runTransaction(submittedAdRef, (currentClicks) => (currentClicks || 0) + 1);
            }
        }
        return ad;
    });
};


export const saveAdvertisement = (ad: Advertisement) => {
    if (!db) throw new Error("Firebase not configured.");
    const adRef = ref(db, `advertisements/${ad.id}`);
    return set(adRef, ad);
};

export const deleteAdvertisement = (adId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const adRef = ref(db, `advertisements/${adId}`);
    return remove(adRef);
}

// --- Submitted Ads ---
export const saveSubmittedAd = async (data: Omit<SubmittedAd, 'id' | 'status' | 'submissionDate'>) => {
    if (!db) throw new Error("Firebase not configured.");
    const adsRef = ref(db, 'submittedAds');
    const newAdRef = push(adsRef);
    const adData = {
        ...data,
        id: newAdRef.key,
        status: 'pending' as const,
        submissionDate: new Date().toISOString(),
        currentViews: 0,
        currentClicks: 0,
    };
    await set(newAdRef, adData);
};

export const getSubmittedAds = (subscribe: boolean = true, callback: (ads: SubmittedAd[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const adsRef = ref(db, 'submittedAds');
    const unsubscribe = onValue(adsRef, (snapshot) => {
        if (snapshot.exists()) {
            const adsData = snapshot.val();
            const adsList = Object.keys(adsData).map(id => ({
                id,
                ...adsData[id]
            })).sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
            callback(adsList);
        } else {
            callback([]);
        }
    });
    return unsubscribe;
};

export const getUserSubmittedAds = (userId: string, callback: (ads: SubmittedAd[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const adsQuery = query(ref(db, 'submittedAds'), orderByChild('userId'), equalTo(userId));
    const unsubscribe = onValue(adsQuery, (snapshot) => {
        if (snapshot.exists()) {
            const adsData = snapshot.val();
            const adsList = Object.keys(adsData).map(id => ({
                id,
                ...adsData[id]
            })).sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
            callback(adsList);
        } else {
            callback([]);
        }
    });
    return unsubscribe;
};

export const approveSubmittedAd = async (submittedAd: SubmittedAd) => {
    if (!db) throw new Error("Firebase not configured.");

    const updates: { [key: string]: any } = {};
    
    // 1. Update status of the submitted ad
    updates[`submittedAds/${submittedAd.id}/status`] = 'approved';

    // 2. Create a new "live" advertisement from the submission
    const newAdId = uuidv4();
    const newAdvertisement: Advertisement = {
        id: newAdId,
        advertiserName: submittedAd.advertiserName,
        imageUrl: submittedAd.imageUrl,
        linkUrl: submittedAd.linkUrl,
        maxViews: submittedAd.targetViews,
        maxClicks: 0, // Clicks are not targeted in this version
        currentViews: 0,
        currentClicks: 0,
        isActive: true,
    };
    updates[`advertisements/${newAdId}`] = newAdvertisement;
    
    // Link the submitted ad to the live ad for stat tracking
    updates[`submittedAds/${submittedAd.id}/liveAdId`] = newAdId;
    updates[`advertisements/${newAdId}/submittedAdId`] = submittedAd.id;

    return update(ref(db), updates);
}

export const rejectSubmittedAd = async (adId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const adRef = ref(db, `submittedAds/${adId}`);
    return update(adRef, { status: 'rejected' });
}


// --- Dashboard Chart Data ---

export const getMonthlyUserGrowth = async (): Promise<{ name: string; total: number }[]> => {
    if (!db) return [];
    
    const now = new Date();
    const monthlyData: { [key: string]: number } = {};
    const monthLabels: string[] = [];

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const monthKey = format(d, 'yyyy-MM');
        const monthLabel = format(d, 'MMM');
        monthlyData[monthKey] = 0;
        if (!monthLabels.includes(monthLabel)) {
            monthLabels.push(monthLabel);
        }
    }
    
    const usersRef = ref(db, 'users');
    
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.createdAt) {
                    try {
                        const date = new Date(user.createdAt);
                         // Check if the date is valid
                        if (!isNaN(date.getTime())) {
                            const monthKey = format(date, 'yyyy-MM');
                            if (monthlyData.hasOwnProperty(monthKey)) {
                                monthlyData[monthKey]++;
                            }
                        }
                    } catch (e) {
                        // Ignore invalid date formats
                    }
                }
            });
        }
    } catch(e) {
        console.error("Error fetching user growth data: ", e);
    }

    // Format for chart
    return monthLabels.map(label => {
        const monthKey = Object.keys(monthlyData).find(key => format(new Date(key), 'MMM') === label) || '';
        return { name: label, total: monthlyData[monthKey] || 0 };
    });
};


export const getTopToolsByClicks = async (limit: number = 7): Promise<{ name: string; clicks: number }[]> => {
    if (!db) return [];

    const toolsRef = ref(db, 'tools');
    const toolsStatsRef = ref(db, 'tool_stats');

    try {
        const [toolsSnapshot, statsSnapshot] = await Promise.all([get(toolsRef), get(statsStatsRef)]);
        
        if (statsSnapshot.exists()) {
            const allTools = toolsSnapshot.val() || {};
            const statsData = statsSnapshot.val();

            const allToolsData = Object.keys(statsData).map(toolId => ({
                id: toolId,
                clicks: statsData[toolId].clicks || 0,
            }));

            // Sort by clicks descending and take the limit
            const sortedTools = allToolsData.sort((a, b) => b.clicks - a.clicks);
            const topTools = sortedTools.slice(0, limit);

            // Map to the final format with tool names
            return topTools.map(toolData => {
                const toolInfo = allTools[toolData.id];
                return {
                    name: toolInfo ? toolInfo.name : 'Unknown Tool',
                    clicks: toolData.clicks,
                };
            });
        }
    } catch (e) {
        console.error("Error fetching tool popularity data: ", e);
    }
    return [];
};


// --- Comments System ---

export const postComment = async (toolId: string, text: string, user: User) => {
    if (!db) throw new Error("Firebase not configured.");
    const commentsRef = ref(db, `comments/${toolId}`);
    const newCommentRef = push(commentsRef);
    const commentData = {
        id: newCommentRef.key,
        uid: user.uid,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL,
        text: text,
        timestamp: serverTimestamp()
    };
    await set(newCommentRef, commentData);
}

export const postReply = async (toolId: string, commentId: string, text: string, user: User) => {
    if (!db) throw new Error("Firebase not configured.");
    const repliesRef = ref(db, `comments/${toolId}/${commentId}/replies`);
    const newReplyRef = push(repliesRef);
    const replyData = {
        id: newReplyRef.key,
        uid: user.uid,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL,
        text: text,
        timestamp: serverTimestamp()
    };
    await set(newReplyRef, replyData);
}

export const updateComment = async (toolId: string, commentId: string, text: string, user: User) => {
    if (!db) throw new Error("Firebase not configured.");
    const commentRef = ref(db, `comments/${toolId}/${commentId}`);
    const snapshot = await get(commentRef);
    if (snapshot.exists() && snapshot.val().uid === user.uid) {
        await update(commentRef, { text, editedTimestamp: serverTimestamp() });
    } else {
        throw new Error("You don't have permission to edit this comment.");
    }
};

export const deleteComment = async (toolId: string, commentId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const commentRef = ref(db, `comments/${toolId}/${commentId}`);
    await remove(commentRef);
};


export const updateReply = async (toolId: string, commentId: string, replyId: string, text: string, user: User) => {
    if (!db) throw new Error("Firebase not configured.");
    const replyRef = ref(db, `comments/${toolId}/${commentId}/replies/${replyId}`);
    const snapshot = await get(replyRef);
    if (snapshot.exists() && snapshot.val().uid === user.uid) {
        await update(replyRef, { text, editedTimestamp: serverTimestamp() });
    } else {
        throw new Error("You don't have permission to edit this reply.");
    }
};

export const deleteReply = async (toolId: string, commentId: string, replyId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const replyRef = ref(db, `comments/${toolId}/${commentId}/replies/${replyId}`);
    await remove(replyRef);
};


export const getComments = (toolId: string, callback: (comments: Comment[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const commentsRef = query(ref(db, `comments/${toolId}`), orderByChild('timestamp'));
    
    return onValue(commentsRef, (snapshot) => {
        if (snapshot.exists()) {
            const commentsData = snapshot.val();
            const commentsList = Object.keys(commentsData).map(key => {
                const comment = commentsData[key];
                const replies = comment.replies ? Object.keys(comment.replies).map(replyKey => ({
                    ...comment.replies[replyKey],
                    id: replyKey,
                })).sort((a,b) => a.timestamp - b.timestamp) : [];

                return {
                    ...comment,
                    id: key,
                    replies: replies
                };
            });
            // Reverse to show newest comments first
            callback(commentsList.reverse());
        } else {
            callback([]);
        }
    });
};

// --- Tools Management ---
export const getTools = (callback: (tools: Tool[]) => void) => {
    if (!db) {
        console.warn("Firebase not configured. Falling back to static tools.");
        callback(STATIC_TOOLS);
        return () => {};
    }

    const toolsRef = query(ref(db, 'tools'), orderByChild('order'));
    
    const unsubscribe = onValue(toolsRef, (snapshot) => {
        if (snapshot.exists()) {
            const toolsData = snapshot.val();
            const toolsList: Tool[] = Object.keys(toolsData).map(key => ({
                ...toolsData[key],
                id: key,
            })).sort((a, b) => a.order - b.order);
            callback(toolsList);
        } else {
            // If no tools in DB, populate with static tools
            console.log("No tools found in Firebase, populating with static tools.");
            const initialTools = STATIC_TOOLS.reduce((acc, tool, index) => {
                const newTool: Omit<Tool, 'id'> & { id?: string } = { ...tool, isEnabled: true, order: index };
                delete newTool.id;
                acc[tool.id] = newTool;
                return acc;
            }, {} as { [key: string]: Omit<Tool, 'id'> });

            set(ref(db, 'tools'), initialTools).then(() => {
                 // The onValue listener will be triggered again after this set,
                 // so we don't need to call callback() here.
            });
        }
    });

    return unsubscribe;
};


export const saveTool = (tool: Omit<Tool, 'id'> & { id?: string }) => {
    if (!db) throw new Error("Firebase not configured.");
    const id = tool.id || uuidv4();
    const toolRef = ref(db, `tools/${id}`);
    
    // Ensure data is clean before saving
    const dataToSave = { ...tool };
    delete dataToSave.id;

    return set(toolRef, dataToSave);
};


export const deleteTool = (toolId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const toolRef = ref(db, `tools/${toolId}`);
    return remove(toolRef);
};

export const updateToolsOrder = (tools: Tool[]) => {
    if (!db) throw new Error("Firebase not configured.");
    const updates: { [key: string]: any } = {};
    tools.forEach((tool, index) => {
        updates[`/tools/${tool.id}/order`] = index;
    });
    return update(ref(db), updates);
};

// --- File Upload ---
export async function uploadFile(file: File, path: string): Promise<string> {
    if (!app) throw new Error("Firebase not configured.");
    const storage = getStorage(app);
    const fileName = `${path}/${uuidv4()}-${file.name}`;
    const fileRef = storageRef(storage, fileName);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
}


export const isConfigured = isFirebaseConfigured && isFirebaseEnabled;

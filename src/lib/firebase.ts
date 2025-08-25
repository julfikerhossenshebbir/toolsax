
// This is a placeholder for Firebase configuration.
// To enable Firebase features, you need to set up a Firebase project and
// add your configuration here.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, runTransaction, onValue, get, set, type Database, serverTimestamp, push, child, update, remove, query, orderByChild, equalTo, limitToLast, orderByValue } from "firebase/database";
import { 
    getAuth, 
    onAuthStateChanged as onFirebaseAuthStateChanged,
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
import type { Comment, Reply, Tool, VipRequest, PaymentMethod, UserData, BugReport } from "@/app/admin/types";
import { ALL_TOOLS as STATIC_TOOLS_FROM_FILE } from "./tools";
import { subMonths, format, startOfMonth } from 'date-fns';

const STATIC_TOOLS: Tool[] = [
  ...STATIC_TOOLS_FROM_FILE,
];


export interface Notification {
    message: string;
    icon: string;
}

export const firebaseConfig = {
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
export const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId;

export function initializeAppOnce() {
    if (isConfigured && isFirebaseEnabled && getApps().length === 0) {
        try {
            app = initializeApp(firebaseConfig);
            db = getDatabase(app);
            auth = getAuth(app);
        } catch (error) {
            console.error("Firebase initialization error:", error);
        }
    }
}

// Call initialization on load
initializeAppOnce();


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

export const getAuthInstance = () => auth;
export const onAuthStateChanged = onFirebaseAuthStateChanged;

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
        role: data.role
    };
};

export const checkAndCreateUser = async (data: { 
    name: string, 
    username: string, 
    email: string, 
    password?: string,
    uid?: string, 
    isSocial?: boolean,
    photoURL?: string,
    phone?: string,
    dob?: string, 
    country?: string 
}) => {
    if (!auth || !db) throw new Error("Firebase not configured.");
    
    const usernameAvailable = await isUsernameAvailable(data.username);
    if (!usernameAvailable) {
        throw new Error(`Username '${data.username}' is already taken. Please choose another one.`);
    }

    let user: User;
    let isNewUser = false;

    if (data.isSocial && data.uid) {
        // Social sign-up flow for a user who needs to complete their profile
        const existingUser = auth.currentUser;
        if (!existingUser || existingUser.uid !== data.uid) {
            throw new Error("Mismatched user session. Please try signing in again.");
        }
        user = existingUser;
    } else if (data.password) {
        // Email sign-up flow
        const userCredential = await signUpWithEmail(data.email, data.password);
        user = userCredential.user;
        isNewUser = true;
    } else {
        throw new Error("Invalid sign-up data. Password or social provider info is missing.");
    }

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: data.name, photoURL: data.photoURL });

    const userRef = ref(db, `users/${user.uid}`);
    
    // Construct the data to be saved to the database.
    const userData: any = {
        name: data.name,
        username: data.username.toLowerCase(),
        email: data.email,
        photoURL: data.photoURL || '',
        lastLogin: serverTimestamp(),
        role: 'user',
    };

    // Add optional fields if they exist
    if (data.phone) userData.phone = data.phone;
    if (data.dob) userData.dob = data.dob;
    if (data.country) userData.country = data.country;

    // For new email users, set createdAt
    if (isNewUser) {
        userData.createdAt = serverTimestamp();
        await set(userRef, userData);
    } else {
        // For social users completing their profile, update existing record
        await update(userRef, userData);
    }

    // Save the username for easy lookup
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

export const getUserData = async (uid: string): Promise<UserData | null> => {
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


export const updateUserData = (uid: string, data: Partial<UserData>) => {
    if (!db) return;
    const userRef = ref(db, `users/${uid}`);
    // Create a new object with only the fields to be updated, excluding undefined ones.
    const updates: { [key: string]: any } = {};
    Object.keys(data).forEach(key => {
        const dataKey = key as keyof UserData;
        if (data[dataKey] !== undefined) {
            updates[key] = data[dataKey];
        }
    });
    return update(userRef, updates);
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

export const getStats = (subscribe: boolean = true, callback?: (stats: { views: number; tool_clicks: number; users: number, vip_users: number }) => void) => {
  if (!db) {
    if(callback) callback({ views: 0, tool_clicks: 0, users: 0, vip_users: 0 });
    return () => {};
  }
  
  const statsRef = ref(db, 'stats');
  
  if (subscribe && callback) {
      const unsubscribe = onValue(statsRef, (snapshot) => {
        const data = snapshot.val() || { views: 0, tool_clicks: 0, users: 0, vip_users: 0 };
        callback(data);
      });
      return unsubscribe;
  } else {
      return get(statsRef).then(snapshot => snapshot.val() || { views: 0, tool_clicks: 0, users: 0, vip_users: 0 });
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
        const [toolsSnapshot, statsSnapshot] = await Promise.all([get(toolsRef), get(statsSnapshot)]);
        
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


// --- Payment Methods Management ---

const STATIC_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'bkash', name: 'bKash', icon: 'https://paylogo.pages.dev/bkash.png', accountNumber: '01964638683', isLink: false, order: 0 },
    { id: 'nagad', name: 'Nagad', icon: 'https://paylogo.pages.dev/nagad.jpg', accountNumber: '01964638683', isLink: false, order: 1 },
    { id: 'rocket', name: 'Rocket', icon: 'https://paylogo.pages.dev/rocket.png', accountNumber: '01964638683', isLink: false, order: 2 },
    { id: 'upay', name: 'Upay', icon: 'https://paylogo.pages.dev/upay.png', accountNumber: '01964638683', isLink: false, order: 3 },
    { id: 'pathaopay', name: 'PathaoPay', icon: 'https://paylogo.pages.dev/pathaopay.png', paymentLink: 'https://pathaopay.me/@helloanaroul/500', isLink: true, order: 4 },
    { id: 'cellfin', name: 'CellFin', icon: 'https://paylogo.pages.dev/cellfin.png', accountNumber: '01964638683', isLink: false, order: 5 },
];

export const getPaymentMethods = (callback: (methods: PaymentMethod[]) => void) => {
    if (!db) {
        console.warn("Firebase not configured. Falling back to static payment methods.");
        callback(STATIC_PAYMENT_METHODS);
        return () => {};
    }
    const methodsRef = query(ref(db, 'payment_methods'), orderByChild('order'));
    
    const unsubscribe = onValue(methodsRef, (snapshot) => {
        if (snapshot.exists()) {
            const methodsData = snapshot.val();
            const methodsList: PaymentMethod[] = Object.keys(methodsData).map(key => ({
                ...methodsData[key],
                id: key,
            })).sort((a, b) => a.order - b.order);
            callback(methodsList);
        } else {
            // Populate with static methods if DB is empty
            const initialMethods = STATIC_PAYMENT_METHODS.reduce((acc, method) => {
                 const newMethod: Omit<PaymentMethod, 'id'> & { id?: string } = { ...method };
                 delete newMethod.id;
                 acc[method.id] = newMethod;
                 return acc;
            }, {} as { [key: string]: Omit<PaymentMethod, 'id'> });
            set(ref(db, 'payment_methods'), initialMethods);
        }
    });

    return unsubscribe;
};

export const savePaymentMethod = (method: Omit<PaymentMethod, 'id'> & { id?: string }) => {
    if (!db) throw new Error("Firebase not configured.");
    const id = method.id || uuidv4();
    const methodRef = ref(db, `payment_methods/${id}`);
    
    const dataToSave = { ...method };
    delete dataToSave.id;

    return set(methodRef, dataToSave);
};

export const deletePaymentMethod = (methodId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const methodRef = ref(db, `payment_methods/${methodId}`);
    return remove(methodRef);
};


// --- VIP System ---
export const submitVipRequest = async (requestData: Omit<VipRequest, 'status' | 'timestamp'>) => {
    if (!db) throw new Error("Firebase not configured.");
    const requestRef = ref(db, `vip_requests/${requestData.uid}`);
    const snapshot = await get(requestRef);
    if (snapshot.exists() && snapshot.val().status === 'pending') {
        throw new Error('You already have a pending request.');
    }
    
    const dataToSave: Omit<VipRequest, 'uid'> = {
        name: requestData.name,
        email: requestData.email,
        photoURL: requestData.photoURL,
        transactionId: requestData.transactionId,
        status: 'pending',
        timestamp: serverTimestamp(),
    };

    return set(requestRef, dataToSave);
};

export const getVipRequestStatus = async (uid: string): Promise<VipRequest['status'] | null> => {
    if (!db) return null;
    const requestRef = ref(db, `vip_requests/${uid}`);
    const snapshot = await get(requestRef);
    return snapshot.exists() ? snapshot.val().status : null;
};

export const getVipRequests = (callback: (requests: VipRequest[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const requestsRef = ref(db, 'vip_requests');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
        if (snapshot.exists()) {
            const requestsData = snapshot.val();
            const requestsList = Object.keys(requestsData).map(uid => ({
                uid,
                ...requestsData[uid]
            }));
            callback(requestsList);
        } else {
            callback([]);
        }
    });
    return unsubscribe;
};

export const approveVipRequest = async (uid: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const userRef = ref(db, `users/${uid}`);
    const requestRef = ref(db, `vip_requests/${uid}`);
    const updates: { [key: string]: any } = {};
    updates[`/users/${uid}/role`] = 'vip';
    updates[`/vip_requests/${uid}/status`] = 'approved';
    const result = await update(ref(db), updates);
    await incrementCounter('stats/vip_users');
    return result;
};

export const rejectVipRequest = async (uid: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const requestRef = ref(db, `vip_requests/${uid}`);
    return update(requestRef, { status: 'rejected' });
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

// --- Bug Reporting ---
export const submitBugReport = async (reportData: Pick<BugReport, 'tool' | 'description'> & { user: Pick<UserData, 'uid' | 'name' | 'email'> }) => {
    if (!db) throw new Error("Firebase not configured.");
    const reportRef = push(ref(db, 'bug_reports'));

    const dataToSave = {
        tool: reportData.tool,
        description: reportData.description,
        reportedBy: {
            uid: reportData.user.uid,
            name: reportData.user.name,
            email: reportData.user.email,
        },
        status: 'new',
        timestamp: serverTimestamp(),
    };
    await set(reportRef, dataToSave);
};


export const getBugReports = (callback: (reports: BugReport[]) => void) => {
    if (!db) {
        callback([]);
        return () => {};
    }
    const reportsRef = query(ref(db, 'bug_reports'), orderByChild('timestamp'));

    return onValue(reportsRef, (snapshot) => {
        if (snapshot.exists()) {
            const reportsData = snapshot.val();
            const reportsList: BugReport[] = Object.keys(reportsData)
                .map(key => ({
                    ...reportsData[key],
                    id: key,
                }))
                .reverse(); // Newest first
            callback(reportsList);
        } else {
            callback([]);
        }
    });
};

export const deleteBugReport = async (reportId: string) => {
    if (!db) throw new Error("Firebase not configured.");
    const reportRef = ref(db, `bug_reports/${reportId}`);
    return remove(reportRef);
};

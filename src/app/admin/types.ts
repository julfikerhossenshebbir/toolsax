export interface UserData {
    uid: string;
    name: string;
    email: string;
    role?: 'admin' | 'user';
    lastLogin: string;
    createdAt: string;
}

export interface Notification {
    icon: string;
    message: string;
}

export interface AdSettings {
    adsEnabled: boolean;
    viewLimit: number; // Per user
    cooldownMinutes: number; // Per user
}

export interface Advertisement {
    id: string;
    advertiserName: string;
    imageUrl: string;
    linkUrl: string;
    maxViews?: number;
    maxClicks?: number;
    currentViews: number;
    currentClicks: number;
    isActive: boolean;
}

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
    viewLimit: number;
    cooldownMinutes: number;
    enabledTools: string[];
}

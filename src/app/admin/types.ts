
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
    maxViews: number; // Renamed from targetViews for consistency
    maxClicks: number;
    currentViews: number;
    currentClicks: number;
    isActive: boolean;
}

export interface SubmittedAd {
    id: string;
    userId: string; // ID of the user who submitted it
    advertiserName: string;
    phone: string;
    linkUrl: string;
    imageUrl: string;
    targetViews: number;
    cost: number;
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
    transactionId: string;
    status: 'pending' | 'approved' | 'rejected';
    submissionDate: string; // ISO date string
    // Performance data to show on user dashboard
    currentViews?: number;
    currentClicks?: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: 'Design' | 'Development' | 'Productivity' | 'Marketing' | 'Utilities' | 'Security' | 'Content' | 'Image' | 'PDF' | 'Social Media' | 'SEO';
  icon: string;
  authRequired?: boolean;
  isEnabled: boolean;
  order: number;
}

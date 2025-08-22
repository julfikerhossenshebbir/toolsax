
export interface UserData {
    uid: string;
    name: string;
    email: string;
    role?: 'admin' | 'user' | 'vip';
    lastLogin: string;
    createdAt: string;
}

export interface Notification {
    icon: string;
    message: string;
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
  isPremium?: boolean;
}

export interface VipRequest {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  transactionId: string;
  timestamp: any;
  status: 'pending' | 'approved' | 'rejected';
}

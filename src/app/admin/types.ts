


export interface UserData {
    uid: string;
    name: string;
    username: string;
    email: string;
    role?: 'admin' | 'user' | 'vip';
    lastLogin: string;
    createdAt: string;
    photoURL?: string;
    bio?: string;
    phone?: string;
    country?: string;
    dob?: string;
    social?: {
        twitter?: string;
        github?: string;
        website?: string;
    };
    favorites?: string[];
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

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  accountNumber?: string;
  paymentLink?: string;
  isLink: boolean;
  order: number;
}

export interface BugReport {
    id: string;
    tool: string;
    description: string;
    status: 'new' | 'in-progress' | 'resolved';
    timestamp: any;
    reportedBy: {
        uid: string;
        name: string;
        email: string;
    };
}

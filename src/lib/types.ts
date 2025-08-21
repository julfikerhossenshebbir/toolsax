export interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: 'Design' | 'Development' | 'Productivity' | 'Marketing' | 'Utilities' | 'Security' | 'Content' | 'Image' | 'PDF' | 'Social Media' | 'SEO';
  icon: string;
  authRequired?: boolean;
}

export interface ToolStat {
  views: number;
  users: number;
}

export interface Reply {
  id: string;
  uid: string;
  authorName: string;
  authorPhotoURL?: string;
  text: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  uid: string;
  authorName: string;
  authorPhotoURL?: string;
  text: string;
  timestamp: number;
  replies: Reply[];
}

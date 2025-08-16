export interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: 'Design' | 'Development' | 'Productivity' | 'Marketing' | 'Utilities';
  icon: string;
}

export interface ToolStat {
  views: number;
  users: number;
}

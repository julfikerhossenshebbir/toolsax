export interface Tool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: 'Design' | 'Development' | 'Productivity' | 'Marketing';
  icon: string;
}

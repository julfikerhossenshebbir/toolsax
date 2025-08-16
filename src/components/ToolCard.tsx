import Link from 'next/link';
import { Tool } from '@/lib/types';
import Icon from './Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

const ToolCard = ({ tool, onClick }: ToolCardProps) => {
  return (
    <Link href={`/tool/${tool.id}`} passHref>
      <Card 
        onClick={onClick}
        className="h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 bg-card/50"
      >
        <CardHeader className="flex-row gap-4 items-center">
          <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={tool.icon} className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
            <Badge variant="outline" className="mt-1">{tool.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;

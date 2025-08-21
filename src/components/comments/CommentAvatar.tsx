
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface CommentAvatarProps {
  user: {
    name?: string | null;
    photoURL?: string | null;
  };
}

export default function CommentAvatar({ user }: CommentAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return <User className="h-4 w-4" />;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.photoURL ?? undefined} alt={user.name ?? 'User'} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

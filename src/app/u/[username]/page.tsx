
import { getUserPublicProfile, getUidByUsername } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params;
  const publicProfile = await getUserPublicProfile(username);

  if (!publicProfile) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${publicProfile.name || publicProfile.username} | Toolsax`,
    description: `View the profile of ${publicProfile.name || publicProfile.username} on Toolsax.`,
    openGraph: {
        title: `${publicProfile.name || publicProfile.username} | Toolsax`,
        description: `View the profile of ${publicProfile.name || publicProfile.username} on Toolsax.`,
        images: [{ url: publicProfile.photoURL || '' }],
    },
    twitter: {
        card: 'summary',
        title: `${publicProfile.name || publicProfile.username} | Toolsax`,
        description: `View the profile of ${publicProfile.name || publicProfile.username} on Toolsax.`,
        images: [publicProfile.photoURL || ''],
    },
  };
}


export default async function UserProfilePage({ params }: Props) {
  const { username } = params;
  const publicProfile = await getUserPublicProfile(username);

  if (!publicProfile) {
    notFound();
  }

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-primary/20">
            <AvatarImage src={publicProfile.photoURL || undefined} alt={publicProfile.name || publicProfile.username} />
            <AvatarFallback className="text-4xl">
              {getInitials(publicProfile.name || publicProfile.username)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{publicProfile.name || 'User'}</CardTitle>
          <CardDescription>@{publicProfile.username}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">More user details will be available here in the future.</p>
        </CardContent>
      </Card>
    </div>
  );
}

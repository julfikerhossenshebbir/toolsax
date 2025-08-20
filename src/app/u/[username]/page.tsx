
import { getUserPublicProfile } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';
import { formatDistanceToNow } from 'date-fns';
import { ALL_TOOLS } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import SectionDivider from '@/components/SectionDivider';
import { Twitter, Github, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    description: publicProfile.bio || `View the profile of ${publicProfile.name || publicProfile.username} on Toolsax.`,
    openGraph: {
        title: `${publicProfile.name || publicProfile.username} | Toolsax`,
        description: publicProfile.bio || `View the profile of ${publicProfile.name || publicProfile.username} on Toolsax.`,
        images: [{ url: publicProfile.photoURL || '' }],
    },
    twitter: {
        card: 'summary',
        title: `${publicProfile.name || publicProfile.username} | Toolsax`,
        description: publicProfile.bio || `View the profile of ${publicProfile.name || publicProfile.username} on Toolsax.`,
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

  const lastActive = publicProfile.lastLogin 
    ? formatDistanceToNow(new Date(publicProfile.lastLogin), { addSuffix: true })
    : 'Never';

  const favoriteTools = publicProfile.favorites 
    ? ALL_TOOLS.filter(tool => publicProfile.favorites.includes(tool.id))
    : [];

  const originalIndexMap = new Map<string, number>();
    ALL_TOOLS.forEach((tool, index) => {
        originalIndexMap.set(tool.id, index);
    });

  const socialLinks = publicProfile.social ? Object.entries(publicProfile.social).filter(([_, url]) => url) : [];

  const addHttp = (url: string) => {
    if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-primary/20">
              <AvatarImage src={publicProfile.photoURL || undefined} alt={publicProfile.name || publicProfile.username} />
              <AvatarFallback className="text-4xl">
                {getInitials(publicProfile.name || publicProfile.username)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{publicProfile.name || 'User'}</CardTitle>
            <CardDescription>@{publicProfile.username}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {publicProfile.bio && <p className="text-muted-foreground max-w-xl mx-auto">{publicProfile.bio}</p>}
            
            <div className="mt-4 flex justify-center gap-3">
              {socialLinks.map(([key, url]) => {
                  let Icon;
                  switch(key) {
                      case 'github': Icon = Github; break;
                      case 'twitter': Icon = Twitter; break;
                      case 'website': Icon = Globe; break;
                      default: return null;
                  }
                  return (
                      <Button asChild key={key} variant="outline" size="icon">
                          <a href={addHttp(url)} target="_blank" rel="noopener noreferrer">
                            <Icon className="h-4 w-4" />
                          </a>
                      </Button>
                  )
              })}
            </div>

            <p className="text-sm text-muted-foreground mt-6">Last active: {lastActive}</p>
          </CardContent>
        </Card>

        {favoriteTools.length > 0 && (
          <div className="mt-12">
            <SectionDivider />
            <h2 className="text-2xl font-bold text-center mb-6">Favorite Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTools.map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool}
                  index={originalIndexMap.get(tool.id) ?? 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

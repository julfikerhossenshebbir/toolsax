
'use client';

import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const { toast } = useToast();

    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: 'Copied to clipboard!',
                description: 'You can now share the link.',
            });
        });
    };

    return (
        <div className="flex items-center gap-2">
            <p className="text-sm font-semibold mr-2">Share:</p>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                </Button>
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                </Button>
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                </Button>
            </a>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <LinkIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}

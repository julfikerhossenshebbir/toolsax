import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Toolsax',
    description: 'Get in touch with the Toolsax team.',
};

const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
);


export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>We'd love to hear from you. Reach out to us for support, feedback, or inquiries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>The best way to get in touch with us is through Telegram.</p>
            <Button asChild size="lg">
                <a href="https://t.me/your-telegram-username" target="_blank" rel="noopener noreferrer">
                    <TelegramIcon /> Contact on Telegram
                </a>
            </Button>
            <p className="text-sm text-muted-foreground pt-4">
                Please note that our response time may vary. We appreciate your patience and will get back to you as soon as possible.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

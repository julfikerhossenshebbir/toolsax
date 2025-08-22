'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export default function AdvertiseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
             <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
                <Card className="max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Please Log In</CardTitle>
                        <CardDescription>
                            You need to be logged in to submit an advertisement. Please log in or create an account to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login?redirect=/advertise">Log In or Sign Up</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <>{children}</>;
}

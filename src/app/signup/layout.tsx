
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && userData?.username) {
            // User is fully logged in and has a username, redirect to profile
            router.replace('/profile');
        }
    }, [user, userData, loading, router]);


    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    if (user && userData?.username) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }


    // Allow rendering children if user is null or doesn't have a username yet
    return <>{children}</>;
}

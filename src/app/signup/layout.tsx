
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
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            // If user is already logged in, check if they have a username.
            // If not, it means they might have dropped off mid-signup.
            // This is a simplified check. A more robust check would be needed in a real app.
            // For now, we redirect to profile.
            router.replace('/profile');
        }
    }, [user, loading, router]);


    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    
    // Allow rendering children if user is null or still loading.
    // The signup page itself will handle the step-by-step logic.
    return <>{children}</>;
}

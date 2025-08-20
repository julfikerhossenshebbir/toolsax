'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getUserData } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (loading) return;

            if (!user) {
                router.replace('/');
                return;
            }

            const userData = await getUserData(user.uid);
            if (userData?.role === 'admin') {
                setIsAdmin(true);
            } else {
                router.replace('/');
            }
            setIsChecking(false);
        };

        checkAdminStatus();

    }, [user, loading, router]);


    if (isChecking || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAdmin) {
        // This is a fallback, though the redirect should have already happened.
        return null;
    }

    return <>{children}</>;
}

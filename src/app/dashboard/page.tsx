
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import MyAds from './MyAds';
import { getUserSubmittedAds } from '@/lib/firebase';
import type { SubmittedAd } from '@/app/admin/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState<SubmittedAd[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login?redirect=/dashboard');
      return;
    }

    const unsubscribe = getUserSubmittedAds(user.uid, (userAds) => {
      setAds(userAds);
      setIsDataLoading(false);
    });
    
    return () => unsubscribe();
  }, [user, loading, router]);


  if (loading || isDataLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
            <div>
                 <h1 className="text-3xl font-bold">My Dashboard</h1>
                <p className="text-muted-foreground">Welcome, {user?.displayName || 'User'}. Manage your ads here.</p>
            </div>
            <Button asChild>
                <Link href="/advertise">Submit a New Ad</Link>
            </Button>
        </div>
        <MyAds ads={ads} />
    </div>
  );
}

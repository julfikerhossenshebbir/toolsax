
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import JoinVipForm from './JoinVipForm';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getVipRequestStatus, getUserData } from '@/lib/firebase';
import { Loader2, BadgeCheck, Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function JoinVipPage() {
    const { user } = useAuth();
    const [status, setStatus] = useState<'loading' | 'form' | 'pending' | 'vip'>('loading');

    const fetchStatus = () => {
        if (user) {
            getUserData(user.uid).then(userData => {
                if (userData?.role === 'vip' || userData?.role === 'admin') {
                    setStatus('vip');
                } else {
                    getVipRequestStatus(user.uid).then(requestStatus => {
                        if (requestStatus === 'pending') {
                            setStatus('pending');
                        } else {
                            setStatus('form');
                        }
                    });
                }
            });
        }
    };
    
    useEffect(() => {
        fetchStatus();
    }, [user]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
            case 'vip':
                return (
                    <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800 dark:text-green-300">You are already a VIP!</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-400">
                            Thank you for your support. You have access to all premium features.
                        </AlertDescription>
                    </Alert>
                );
            case 'pending':
                return (
                     <Alert variant="default" className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800 dark:text-yellow-300">Your Request is Pending</AlertTitle>
                        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                           Thank you for your submission! Your VIP request is currently under review. We will process it shortly. Please wait for verification.
                        </AlertDescription>
                    </Alert>
                );
            case 'form':
            default:
                return <JoinVipForm onSuccessfulSubmit={() => setStatus('pending')} />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Join VIP</CardTitle>
                    <CardDescription>
                        Unlock exclusive tools and features by becoming a VIP member.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
}

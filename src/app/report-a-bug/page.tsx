
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';
import { Tool } from '@/lib/types';
import ReportBugForm from './ReportBugForm';
import { ALL_TOOLS } from '@/lib/tools';
import { useEffect, useState } from 'react';
import { listenToTools } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ReportBugPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
           router.push('/login?redirect=/report-a-bug');
        } else {
            const unsubscribe = listenToTools((loadedTools) => {
                setTools(loadedTools);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user, router]);


    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Report a Bug</CardTitle>
                    <CardDescription>
                        We appreciate your help in making our tools better. Please fill out the form below to report an issue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                       <p>Loading tools...</p>
                    ) : (
                       <ReportBugForm tools={tools} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

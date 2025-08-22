
'use client';

import { useEffect, useState } from 'react';
import { getVipRequests } from '@/lib/firebase';
import type { VipRequest } from '../types';
import VipRequestsManagement from '../dashboard/VipRequestsManagement';

export default function AdminVipRequestsPage() {
    const [requests, setRequests] = useState<VipRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getVipRequests((loadedRequests) => {
            setRequests(loadedRequests);
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">VIP Requests</h2>
            <p className="text-muted-foreground">Review and manage all user requests for VIP membership.</p>
            <VipRequestsManagement initialRequests={requests} isLoading={loading} />
        </div>
    );
}

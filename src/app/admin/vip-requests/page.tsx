
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
            <VipRequestsManagement initialRequests={requests} isLoading={loading} />
        </div>
    );
}

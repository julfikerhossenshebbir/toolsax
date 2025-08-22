
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStats, getNotificationMessage, getAdSettings, getAllAdvertisements, getTools } from '@/lib/firebase';
import { StatCard, UserOverviewChart, ToolPopularityChart } from './components';
import { Users, BarChart, AreaChart } from 'lucide-react';
import type { UserData, Notification as NotifType, AdSettings, Advertisement, Tool } from '../types';

export default function AdminDashboardPage() {
    
    const [stats, setStats] = useState({ users: 0, tool_clicks: 0, views: 0 });
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        getStats(false).then(s => {
          setStats(s)
          setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    return (
        <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Users" value={stats.users.toLocaleString()}>
                    <Users />
                </StatCard>
                <StatCard title="Total Clicks" value={stats.tool_clicks.toLocaleString()}>
                    <BarChart />
                </StatCard>
                <StatCard title="Total Views" value={stats.views.toLocaleString()}>
                    <AreaChart />
                </StatCard>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <UserOverviewChart />
                <ToolPopularityChart />
            </div>
        </div>
    );
}

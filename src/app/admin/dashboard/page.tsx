
'use client';

import { useEffect, useState } from 'react';
import { getStats, getUserData } from '@/lib/firebase';
import { StatCard, UserOverviewChart, ToolPopularityChart } from './components';
import { Users, MousePointerClick, Eye, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardPage() {
    
    const [stats, setStats] = useState({ users: 0, tool_clicks: 0, views: 0, vip_users: 0 });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        getStats(false).then(s => {
          setStats(s)
          setLoading(false);
        });
    }, []);

    return (
        <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={stats.users.toLocaleString()} isLoading={loading}>
                    <Users />
                </StatCard>
                 <StatCard title="VIP Users" value={stats.vip_users.toLocaleString()} isLoading={loading}>
                    <Crown />
                </StatCard>
                <StatCard title="Total Tool Clicks" value={stats.tool_clicks.toLocaleString()} isLoading={loading}>
                    <MousePointerClick />
                </StatCard>
                <StatCard title="Total Page Views" value={stats.views.toLocaleString()} isLoading={loading}>
                    <Eye />
                </StatCard>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <UserOverviewChart />
                <ToolPopularityChart />
            </div>
        </div>
    );
}

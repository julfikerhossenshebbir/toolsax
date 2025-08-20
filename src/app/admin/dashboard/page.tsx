
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStats, subscribeToAllUsers, getNotificationMessage } from '@/lib/firebase';
import { StatCard, UsersTable, columns, NotificationForm, UserOverviewChart, ToolPopularityChart } from './components';
import { Users, BarChart, AreaChart } from 'lucide-react';
import type { UserData, Notification as NotifType } from '../types';

export default function AdminDashboardPage() {
    
    const [stats, setStats] = useState({ users: 0, tool_clicks: 0, views: 0 });
    const [users, setUsers] = useState<UserData[]>([]);
    const [notifications, setNotifications] = useState<NotifType[]>([]);

    useEffect(() => {
        // Fetch initial static data
        getStats(false).then(s => setStats(s));
        getNotificationMessage(false).then(n => setNotifications(n as NotifType[]));

        // Subscribe to real-time user updates
        const unsubscribe = subscribeToAllUsers((updatedUsers) => {
            setUsers(updatedUsers as UserData[]);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
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

                <div className="lg:col-span-full">
                     <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <UsersTable columns={columns} data={users} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-full">
                    <NotificationForm currentNotifications={notifications} />
                </div>
            </div>
        </div>
    );
}

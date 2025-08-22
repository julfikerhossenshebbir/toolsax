
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStats, subscribeToAllUsers, getNotificationMessage, getAdSettings, getAllAdvertisements, getTools } from '@/lib/firebase';
import { StatCard, UsersTable, columns, NotificationForm, UserOverviewChart, ToolPopularityChart, AdSettingsForm } from './components';
import { Users, BarChart, AreaChart } from 'lucide-react';
import type { UserData, Notification as NotifType, AdSettings, Advertisement, Tool } from '../types';
import AdManagementForm from './AdManagementForm';
import ToolsManagement from './ToolsManagement';

const defaultAdSettings: AdSettings = {
    adsEnabled: true,
    viewLimit: 3,
    cooldownMinutes: 30,
};

export default function AdminDashboardPage() {
    
    const [stats, setStats] = useState({ users: 0, tool_clicks: 0, views: 0 });
    const [users, setUsers] = useState<UserData[]>([]);
    const [notifications, setNotifications] = useState<NotifType[]>([]);
    const [adSettings, setAdSettings] = useState<AdSettings>(defaultAdSettings);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        // Fetch initial static data
        getStats(false).then(s => setStats(s));
        getNotificationMessage(false).then(n => setNotifications(n as NotifType[]));

        // Subscribe to real-time updates
        unsubscribers.push(subscribeToAllUsers((updatedUsers) => {
            setUsers(updatedUsers as UserData[]);
        }));

        unsubscribers.push(getAdSettings(true, (settings) => {
            setAdSettings(settings || defaultAdSettings);
        }));
        
        unsubscribers.push(getAllAdvertisements(true, (ads) => {
            setAdvertisements(ads);
        }));

        unsubscribers.push(getTools((loadedTools) => {
            setTools(loadedTools);
            setLoading(false);
        }));

        // Cleanup subscription on component unmount
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
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
                <div className="lg:col-span-full">
                    <ToolsManagement initialTools={tools} isLoading={loading} />
                </div>
                 <div className="lg:col-span-full">
                    <AdManagementForm currentAds={advertisements} />
                </div>

                <UserOverviewChart />
                <ToolPopularityChart />

                <div className="lg:col-span-full">
                     <AdSettingsForm currentAdSettings={adSettings} />
                </div>

                <div className="lg:col-span-full">
                     <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                             <CardDescription>View and manage all registered users.</CardDescription>
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


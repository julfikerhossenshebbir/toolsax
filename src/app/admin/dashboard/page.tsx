import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllUsers, getStats, getNotificationMessage } from '@/lib/firebase';
import { StatCard, UsersTable, columns, NotificationForm, UserOverviewChart, ToolPopularityChart } from './components';
import { AreaChart, BarChart, Users } from 'lucide-react';
import type { UserData, Notification as NotifType } from '../types';

export default async function AdminDashboardPage() {
    
    const stats = await getStats(false);
    const users = await getAllUsers();
    const notifications = await getNotificationMessage(false);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-4">
                    <UserOverviewChart />
                    <ToolPopularityChart />
                </div>
                 <div className="col-span-3 space-y-4">
                    <NotificationForm currentNotifications={notifications as NotifType[]} />
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <UsersTable columns={columns} data={users as UserData[]} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

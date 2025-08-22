
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { subscribeToAllUsers } from '@/lib/firebase';
import { UsersTable, columns } from '../dashboard/components';
import type { UserData } from '../types';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToAllUsers((updatedUsers) => {
            setUsers(updatedUsers as UserData[]);
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View and manage all registered users on your platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable columns={columns} data={users} />
                </CardContent>
            </Card>
        </div>
    );
}

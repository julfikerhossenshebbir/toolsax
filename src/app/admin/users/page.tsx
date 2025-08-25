
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { subscribeToAllUsers } from '@/lib/firebase';
import { UsersTable, columns } from '../dashboard/components';
import type { UserData } from '../types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAllUsers((updatedUsers) => {
            setUsers(updatedUsers as UserData[]);
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all registered users on your platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                       <UsersTable columns={columns} data={users} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

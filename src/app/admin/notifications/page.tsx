
'use client';

import { useEffect, useState } from 'react';
import { getNotificationMessage } from '@/lib/firebase';
import { NotificationForm } from '../dashboard/components';
import type { Notification as NotifType } from '../types';

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<NotifType[]>([]);

    useEffect(() => {
       getNotificationMessage(false).then(n => setNotifications(n as NotifType[]));
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Global Notifications</h2>
            <p className="text-muted-foreground">Send site-wide notifications that appear in the header for all users.</p>
            <NotificationForm currentNotifications={notifications} />
        </div>
    );
}

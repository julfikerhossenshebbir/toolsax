
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
            <NotificationForm currentNotifications={notifications} />
        </div>
    );
}

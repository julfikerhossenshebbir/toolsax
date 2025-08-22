
'use client';

import { useEffect, useState } from 'react';
import { getPaymentMethods } from '@/lib/firebase';
import type { PaymentMethod } from '../types';
import PaymentMethodsManagement from '../dashboard/PaymentMethodsManagement';

export default function AdminPaymentMethodsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getPaymentMethods((loadedMethods) => {
            setMethods(loadedMethods);
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Payment Methods</h2>
            <p className="text-muted-foreground">Manage the payment options available for VIP membership.</p>
            <PaymentMethodsManagement initialMethods={methods} isLoading={loading} />
        </div>
    );
}

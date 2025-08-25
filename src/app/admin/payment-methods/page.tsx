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
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            <PaymentMethodsManagement initialMethods={methods} isLoading={loading} />
        </div>
    );
}

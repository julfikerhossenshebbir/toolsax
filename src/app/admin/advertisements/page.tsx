
'use client';

import { useEffect, useState } from 'react';
import { getAdSettings, getAllAdvertisements } from '@/lib/firebase';
import { AdSettingsForm } from '../dashboard/components';
import type { AdSettings, Advertisement } from '../types';
import AdManagementForm from '../dashboard/AdManagementForm';
import { Separator } from '@/components/ui/separator';

const defaultAdSettings: AdSettings = {
    adsEnabled: true,
    viewLimit: 3,
    cooldownMinutes: 30,
};

export default function AdminAdvertisementsPage() {
    const [adSettings, setAdSettings] = useState<AdSettings>(defaultAdSettings);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    
    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(getAdSettings(true, (settings) => {
            setAdSettings(settings || defaultAdSettings);
        }));
        
        unsubscribers.push(getAllAdvertisements(true, (ads) => {
            setAdvertisements(ads);
        }));

        // Cleanup subscription on component unmount
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Advertisement Settings</h2>
                <p className="text-muted-foreground">Control how and when ads are displayed to your users.</p>
                <AdSettingsForm currentAdSettings={adSettings} />
            </div>
            <Separator />
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Ad Campaign Management</h2>
                 <p className="text-muted-foreground">Manage individual ad campaigns from your advertisers.</p>
                <AdManagementForm currentAds={advertisements} />
            </div>
        </div>
    );
}

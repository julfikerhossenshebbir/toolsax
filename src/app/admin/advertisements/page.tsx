
'use client';

import { useEffect, useState } from 'react';
import { getAdSettings, getAllAdvertisements, getSubmittedAds } from '@/lib/firebase';
import { AdSettingsForm } from '../dashboard/components';
import type { AdSettings, Advertisement, SubmittedAd } from '../types';
import AdManagementForm from '../dashboard/AdManagementForm';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAdsManagement from '../dashboard/UserAdsManagement';

const defaultAdSettings: AdSettings = {
    adsEnabled: true,
    viewLimit: 3,
    cooldownMinutes: 30,
};

export default function AdminAdvertisementsPage() {
    const [adSettings, setAdSettings] = useState<AdSettings>(defaultAdSettings);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [submittedAds, setSubmittedAds] = useState<SubmittedAd[]>([]);
    
    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(getAdSettings(true, (settings) => {
            setAdSettings(settings || defaultAdSettings);
        }));
        
        unsubscribers.push(getAllAdvertisements(true, (ads) => {
            setAdvertisements(ads);
        }));

        unsubscribers.push(getSubmittedAds(true, (ads) => {
            setSubmittedAds(ads);
        }));

        // Cleanup subscription on component unmount
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    return (
        <div className="space-y-6">
            <Tabs defaultValue="campaigns">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="campaigns">Campaign Ads</TabsTrigger>
                    <TabsTrigger value="submissions">User Submitted Ads</TabsTrigger>
                </TabsList>
                <TabsContent value="campaigns" className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight">Campaign Management</h2>
                    <p className="text-muted-foreground mb-4">Manage individual ad campaigns from your advertisers.</p>
                    <AdManagementForm currentAds={advertisements} />
                </TabsContent>
                <TabsContent value="submissions" className="mt-6">
                     <h2 className="text-3xl font-bold tracking-tight">User Ad Submissions</h2>
                    <p className="text-muted-foreground mb-4">Review, approve, or reject advertisements submitted by users.</p>
                    <UserAdsManagement ads={submittedAds} />
                </TabsContent>
            </Tabs>
            
            <Separator />

            <div>
                <h2 className="text-3xl font-bold tracking-tight">Global Ad Settings</h2>
                <p className="text-muted-foreground">Control how and when campaign ads are displayed to your users.</p>
                <AdSettingsForm currentAdSettings={adSettings} />
            </div>
        </div>
    );
}

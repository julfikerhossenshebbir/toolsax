
'use client';

import { useEffect, useState } from "react";
import type { Advertisement } from "@/app/admin/types";
import { getActiveAdvertisement, getSeenAds, incrementAdClicks, incrementAdViews, markAdAsSeen } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export default function SidebarAd() {
    const [ad, setAd] = useState<Advertisement | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAd = async () => {
            setLoading(true);
            try {
                const seenAds = await getSeenAds(user?.uid);
                const adToShow = await getActiveAdvertisement(seenAds);
                if (adToShow) {
                    setAd(adToShow);
                    incrementAdViews(adToShow.id);
                    markAdAsSeen(user?.uid, adToShow.id);
                }
            } catch (error) {
                console.error("Failed to fetch sidebar ad:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [user]);

    const handleAdClick = () => {
        if (ad) {
            incrementAdClicks(ad.id);
            window.open(ad.linkUrl, '_blank');
        }
    };
    
    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        )
    }

    if (!ad) {
        return null; // Don't render anything if no ad is found
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground px-2">SPONSORED</p>
            <Card className="overflow-hidden cursor-pointer" onClick={handleAdClick}>
                <CardContent className="p-0">
                     <Image
                        src={ad.imageUrl}
                        alt={ad.advertiserName}
                        width={300}
                        height={250}
                        className="w-full h-auto object-cover"
                        data-ai-hint="advertisement"
                    />
                    <div className="p-3">
                        <p className="text-sm font-medium">{ad.advertiserName}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

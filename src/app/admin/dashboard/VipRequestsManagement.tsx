
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { approveVipRequestAction, rejectVipRequestAction } from './actions';
import { Loader2, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { VipRequest } from '../types';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface VipRequestsManagementProps {
    initialRequests: VipRequest[];
    isLoading: boolean;
}

export default function VipRequestsManagement({ initialRequests, isLoading }: VipRequestsManagementProps) {
    const [requests, setRequests] = useState<VipRequest[]>([]);
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    useEffect(() => {
        setRequests(initialRequests);
    }, [initialRequests]);
    
    const handleApprove = async (uid: string) => {
        setIsProcessing(prev => ({ ...prev, [uid]: true }));
        const result = await approveVipRequestAction(uid);
        if (result.success) {
            toast({ title: 'VIP Request Approved!', description: 'The user has been granted VIP status.' });
        } else {
            toast({ variant: 'destructive', title: 'Approval Failed', description: result.error });
        }
        setIsProcessing(prev => ({ ...prev, [uid]: false }));
    };
    
    const handleReject = async (uid: string) => {
        setIsProcessing(prev => ({ ...prev, [uid]: true }));
        const result = await rejectVipRequestAction(uid);
        if (result.success) {
            toast({ title: 'VIP Request Rejected.', description: 'The user has been notified.' });
        } else {
            toast({ variant: 'destructive', title: 'Rejection Failed', description: result.error });
        }
        setIsProcessing(prev => ({ ...prev, [uid]: false }));
    };
    

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )
    }

    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <Card>
            <CardHeader>
                <CardTitle>VIP Membership Requests</CardTitle>
                <CardDescription>Review and approve or reject user requests for VIP status.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <div>
                        {pendingRequests.length > 0 ? pendingRequests.map((req) => (
                            <div
                                key={req.uid}
                                className='flex items-center justify-between p-3 border-b bg-card gap-4 last:border-b-0'
                            >
                                <div className="flex items-center gap-3 flex-grow min-w-0">
                                    <Avatar>
                                      <AvatarImage src={req.photoURL} />
                                      <AvatarFallback>{req.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                      <p className="font-medium truncate">{req.name}</p>
                                      <p className="text-xs text-muted-foreground truncate">{req.email}</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded-md">{req.transactionId}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(req.timestamp), 'PPp')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     {isProcessing[req.uid] ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={() => handleApprove(req.uid)}>
                                            <Check className="h-5 w-5 text-green-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleReject(req.uid)}>
                                            <X className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </>
                                    )}
                                </div>
                            </div>
                        )) : (
                           <div className="p-12 text-center text-muted-foreground">No pending VIP requests.</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

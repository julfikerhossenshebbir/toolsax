
'use client';

import { useState } from 'react';
import type { SubmittedAd } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { format } from 'date-fns';
import { approveSubmittedAdAction, rejectSubmittedAdAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';

interface UserAdsManagementProps {
  ads: SubmittedAd[];
}

export default function UserAdsManagement({ ads }: UserAdsManagementProps) {
  const [selectedAd, setSelectedAd] = useState<SubmittedAd | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAction = async (action: 'approve' | 'reject', adId: string) => {
    setIsActionLoading(adId);
    let result;
    if (action === 'approve') {
      result = await approveSubmittedAdAction(adId);
    } else {
      result = await rejectSubmittedAdAction(adId);
    }

    if (result.success) {
      toast({ title: `Ad ${action}d successfully!` });
    } else {
      toast({ variant: 'destructive', title: 'Action Failed', description: result.error });
    }
    setIsActionLoading(null);
  };
  
  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Ad Submissions</CardTitle>
        <CardDescription>Review and manage ads submitted by users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advertiser</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.advertiserName}</TableCell>
                    <TableCell>{format(new Date(ad.submissionDate), 'PPP')}</TableCell>
                    <TableCell>{getStatusBadge(ad.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedAd(ad)}>
                        View Details
                      </Button>
                      {ad.status === 'pending' && (
                        <>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => handleAction('approve', ad.id)}
                            disabled={!!isActionLoading}
                          >
                             {isActionLoading === ad.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => handleAction('reject', ad.id)}
                            disabled={!!isActionLoading}
                          >
                            {isActionLoading === ad.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No user-submitted ads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ad Details</DialogTitle>
            <DialogDescription>
                Submitted by {selectedAd?.advertiserName}
            </DialogDescription>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-4">
                <div className="rounded-md overflow-hidden border">
                    <Image src={selectedAd.imageUrl} alt="Ad creative" width={400} height={200} className="w-full h-auto object-cover"/>
                </div>
                <div><strong>Link:</strong> <a href={selectedAd.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center gap-1">{selectedAd.linkUrl} <ExternalLink className="h-3 w-3" /></a></div>
                <div><strong>Phone:</strong> {selectedAd.phone}</div>
                <div><strong>Payment Method:</strong> {selectedAd.paymentMethod}</div>
                <div><strong>Transaction ID:</strong> {selectedAd.transactionId}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}


'use client';

import type { SubmittedAd } from '@/app/admin/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';

interface MyAdsProps {
  ads: SubmittedAd[];
}

export default function MyAds({ ads }: MyAdsProps) {
  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge>Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Ad Submissions</CardTitle>
        <CardDescription>Here is a list of all the ads you have submitted.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Image</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <Image src={ad.imageUrl} alt="Ad thumbnail" width={80} height={40} className="rounded-md object-cover" />
                    </TableCell>
                    <TableCell>{format(new Date(ad.submissionDate), 'PPP')}</TableCell>
                    <TableCell>{getStatusBadge(ad.status)}</TableCell>
                    <TableCell>
                      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        View Link
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    You have not submitted any ads yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

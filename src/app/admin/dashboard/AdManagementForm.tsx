
'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { saveAdvertisementAction, deleteAdvertisementAction } from './actions';
import { Loader2, Trash2, Edit, PlusCircle, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Advertisement } from '../types';
import { Badge } from '@/components/ui/badge';

const emptyAd: Advertisement = {
    id: '',
    advertiserName: '',
    imageUrl: '',
    linkUrl: '',
    maxViews: 0,
    maxClicks: 0,
    currentViews: 0,
    currentClicks: 0,
    isActive: true,
};

interface AdManagementFormProps {
    currentAds: Advertisement[];
}

export default function AdManagementForm({ currentAds }: AdManagementFormProps) {
    const [ads, setAds] = useState<Advertisement[]>(currentAds);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentAd, setCurrentAd] = useState<Advertisement>(emptyAd);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useState(() => {
        setAds(currentAds);
    });

    const handleOpenForm = (ad?: Advertisement) => {
        setCurrentAd(ad || { ...emptyAd, id: uuidv4() });
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveAdvertisementAction(currentAd);
        if (result.success) {
            toast({ title: 'Advertisement Saved!' });
            setIsFormOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
        }
        setIsSaving(false);
    };

    const handleDelete = async (adId: string) => {
        const result = await deleteAdvertisementAction(adId);
        if (result.success) {
            toast({ title: 'Advertisement Deleted!' });
        } else {
            toast({ variant: 'destructive', title: 'Delete Failed', description: result.error });
        }
    }

    const isExpired = (ad: Advertisement) => {
        const viewsReached = ad.maxViews ? ad.currentViews >= ad.maxViews : false;
        const clicksReached = ad.maxClicks ? ad.currentClicks >= ad.maxClicks : false;
        return viewsReached || clicksReached;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Advertisement Management</CardTitle>
                        <CardDescription>Add, edit, and manage ad campaigns from advertisers.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenForm()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Ad
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Advertiser</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentAds.length > 0 ? currentAds.map(ad => (
                                <TableRow key={ad.id} className={isExpired(ad) ? 'bg-muted/50' : ''}>
                                    <TableCell>
                                        <Badge variant={ad.isActive && !isExpired(ad) ? 'default' : 'secondary'}>
                                            {isExpired(ad) ? 'Expired' : (ad.isActive ? 'Active' : 'Paused')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{ad.advertiserName}</TableCell>
                                    <TableCell>{ad.currentViews.toLocaleString()} / {ad.maxViews?.toLocaleString() || '∞'}</TableCell>
                                    <TableCell>{ad.currentClicks.toLocaleString()} / {ad.maxClicks?.toLocaleString() || '∞'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(ad)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the ad for "{ad.advertiserName}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(ad.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">No advertisements found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{currentAd.id && currentAds.some(ad => ad.id === currentAd.id) ? 'Edit Advertisement' : 'Add New Advertisement'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="advertiserName">Advertiser Name</Label>
                            <Input id="advertiserName" value={currentAd.advertiserName} onChange={(e) => setCurrentAd({ ...currentAd, advertiserName: e.target.value })} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" value={currentAd.imageUrl} onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="linkUrl">Link URL</Label>
                            <Input id="linkUrl" value={currentAd.linkUrl} onChange={(e) => setCurrentAd({ ...currentAd, linkUrl: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="maxViews">Max Views (0 for unlimited)</Label>
                                <Input id="maxViews" type="number" value={currentAd.maxViews} onChange={(e) => setCurrentAd({ ...currentAd, maxViews: Number(e.target.value) })} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="maxClicks">Max Clicks (0 for unlimited)</Label>
                                <Input id="maxClicks" type="number" value={currentAd.maxClicks} onChange={(e) => setCurrentAd({ ...currentAd, maxClicks: Number(e.target.value) })} />
                            </div>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="isActive" checked={currentAd.isActive} onCheckedChange={(checked) => setCurrentAd({ ...currentAd, isActive: checked })} />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

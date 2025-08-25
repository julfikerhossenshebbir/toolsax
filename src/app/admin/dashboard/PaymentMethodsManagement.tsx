'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { savePaymentMethodAction, deletePaymentMethodAction } from './actions';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PaymentMethod } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

const emptyMethod: PaymentMethod = {
    id: '',
    name: '',
    icon: '',
    accountNumber: '',
    paymentLink: '',
    isLink: false,
    order: 0,
};


interface PaymentMethodsManagementProps {
    initialMethods: PaymentMethod[];
    isLoading: boolean;
}

export default function PaymentMethodsManagement({ initialMethods, isLoading }: PaymentMethodsManagementProps) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<PaymentMethod>(emptyMethod);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setMethods(initialMethods);
    }, [initialMethods]);

    const sortedMethods = useMemo(() => {
        return [...methods].sort((a, b) => a.order - b.order);
    }, [methods]);
    
    const handleOpenSheet = (method?: PaymentMethod) => {
        if (method) {
            setCurrentMethod(method);
        } else {
            const newOrder = methods.length > 0 ? Math.max(...methods.map(t => t.order)) + 1 : 0;
            setCurrentMethod({ ...emptyMethod, id: uuidv4(), order: newOrder });
        }
        setIsSheetOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await savePaymentMethodAction(currentMethod);
        if (result.success) {
            toast({ title: 'Payment Method Saved!', description: `${currentMethod.name} has been saved successfully.` });
            setIsSheetOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
        }
        setIsSaving(false);
    };
    
    const handleDelete = async (methodId: string) => {
        const result = await deletePaymentMethodAction(methodId);
        if (result.success) {
            toast({ title: 'Payment Method Deleted!', description: `The method has been permanently deleted.` });
        } else {
            toast({ variant: 'destructive', title: 'Delete Failed', description: result.error });
        }
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

    return (
        <>
            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Payment Methods Management</CardTitle>
                            <CardDescription>Add, edit, and manage all available payment methods.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenSheet()}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Method
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div>
                            {sortedMethods.length > 0 ? sortedMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className='flex items-center justify-between p-3 border-b bg-card last:border-b-0'
                                >
                                    <div className="flex items-center gap-3 flex-grow">
                                        <Image src={method.icon} alt={method.name} width={40} height={40} className="h-8 w-auto object-contain rounded-md" />
                                        <span className="font-medium truncate max-w-xs">{method.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenSheet(method)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(method.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                    <div className="p-12 text-center text-muted-foreground">No payment methods found.</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    {/* This trigger can be hidden as we open it programmatically */}
                    <button className="hidden">Open Sheet</button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-lg w-full flex flex-col">
                    <SheetHeader>
                        <SheetTitle>{currentMethod.id && methods.some(t => t.id === currentMethod.id) ? 'Edit Method' : 'Add New Method'}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-grow overflow-y-auto pr-4 -mr-4 py-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="method-name">Method Name</Label>
                                <Input id="method-name" value={currentMethod.name} onChange={(e) => setCurrentMethod({ ...currentMethod, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="method-icon">Icon URL</Label>
                                 <Input id="method-icon" value={currentMethod.icon} onChange={(e) => setCurrentMethod({ ...currentMethod, icon: e.target.value })} placeholder="https://example.com/icon.png" />
                                 {currentMethod.icon && <Image src={currentMethod.icon} alt="Icon preview" width={40} height={40} className="h-10 w-auto object-contain rounded-md mt-2" />}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="is-link" checked={currentMethod.isLink} onCheckedChange={(checked) => setCurrentMethod({ ...currentMethod, isLink: !!checked })} />
                                <Label htmlFor="is-link">This is a direct payment link</Label>
                            </div>
                            {currentMethod.isLink ? (
                                 <div className="space-y-2">
                                    <Label htmlFor="method-link">Payment Link</Label>
                                    <Input id="method-link" value={currentMethod.paymentLink || ''} onChange={(e) => setCurrentMethod({ ...currentMethod, paymentLink: e.target.value })} placeholder="https://pathaopay.me/@username/500" />
                                </div>
                            ) : (
                                 <div className="space-y-2">
                                    <Label htmlFor="method-number">Account Number / Details</Label>
                                    <Input id="method-number" value={currentMethod.accountNumber || ''} onChange={(e) => setCurrentMethod({ ...currentMethod, accountNumber: e.target.value })} placeholder="e.g., 01234567890" />
                                </div>
                            )}
                             <div className="space-y-2">
                                <Label htmlFor="method-order">Order</Label>
                                <Input id="method-order" type="number" value={currentMethod.order} onChange={(e) => setCurrentMethod({ ...currentMethod, order: parseInt(e.target.value, 10) || 0 })} />
                            </div>
                        </div>
                    </div>
                     <div className="flex-shrink-0 pt-4 border-t">
                        <div className="flex justify-end gap-2">
                             <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
                             <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Method
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

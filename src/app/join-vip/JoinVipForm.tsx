
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitVipRequestAction } from '@/app/admin/dashboard/actions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket } from 'lucide-react';

const paymentMethods = [
    { name: 'bKash', icon: 'https://i.ibb.co/L0f2w98/bkash.png' },
    { name: 'Nagad', icon: 'https://i.ibb.co/P9gpf3y/nagad.png' },
    { name: 'Rocket', icon: 'https://i.ibb.co/3s6Kx9p/rocket.png' },
    { name: 'Upay', icon: 'https://i.ibb.co/L6wMhH4/upay.png' },
    { name: 'PathaoPay', icon: 'https://i.ibb.co/rfnL1rq/pathaopay.png' },
    { name: 'CellFin', icon: 'https://i.ibb.co/j3vN0x6/cellfin.png' },
];

export default function JoinVipForm() {
    const { user } = useAuth();
    const [transactionId, setTransactionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !transactionId) return;

        setIsSubmitting(true);
        const result = await submitVipRequestAction({
            uid: user.uid,
            name: user.displayName || 'Unnamed User',
            email: user.email || 'No email',
            photoURL: user.photoURL || '',
            transactionId,
        });

        if (result.success) {
            toast({
                title: 'Request Submitted!',
                description: 'Your VIP request has been sent for review. Please allow some time for verification.',
            });
            setTransactionId('');
        } else {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: result.error,
            });
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Alert>
                <Rocket className="h-4 w-4" />
                <AlertTitle>Become a VIP Member!</AlertTitle>
                <AlertDescription>
                    <p>Unlock premium tools, get a verified badge on your profile, and enjoy an ad-free experience. To get started, send a payment of <strong>500 BDT</strong> to the account below and submit your transaction ID for verification.</p>
                </AlertDescription>
            </Alert>
            
            <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2 text-center">Payment Methods</h3>
                <p className="text-center text-xl font-bold tracking-wider text-primary">01964638683</p>
                <div className="flex justify-center flex-wrap gap-4 mt-4">
                    {paymentMethods.map(method => (
                        <div key={method.name} className="flex flex-col items-center gap-1">
                            <img src={method.icon} alt={method.name} className="h-8 w-8 object-contain rounded-md" />
                            <span className="text-xs text-muted-foreground">{method.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter the transaction ID from your payment"
                    required
                />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Verification
            </Button>
        </form>
    );
}


'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitVipRequestAction } from '@/app/admin/dashboard/actions';
import { Loader2, Copy, Wallet, Send, Check, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { getPaymentMethods } from '@/lib/firebase';
import type { PaymentMethod } from '@/app/admin/types';
import { Skeleton } from '@/components/ui/skeleton';

const PAYMENT_COST = '500 BDT';

const PaymentMethodSkeleton = () => (
    <div className="flex flex-col items-center justify-center gap-2 p-3 border rounded-lg">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-4 w-20" />
    </div>
);


interface JoinVipFormProps {
    onSuccessfulSubmit: () => void;
}

export default function JoinVipForm({ onSuccessfulSubmit }: JoinVipFormProps) {
    const { user } = useAuth();
    const [transactionId, setTransactionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoadingMethods, setIsLoadingMethods] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = getPaymentMethods((methods) => {
            setPaymentMethods(methods);
            setIsLoadingMethods(false);
        });
        return () => unsubscribe();
    }, []);

    const handleCopyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({
            title: 'Copied!',
            description: `${textToCopy} has been copied to your clipboard.`,
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !transactionId || !selectedMethod) return;

        setIsSubmitting(true);
        try {
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
                onSuccessfulSubmit();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Alert>
                <Wallet className="h-4 w-4" />
                <AlertTitle>Become a VIP Member for {PAYMENT_COST}!</AlertTitle>
                <AlertDescription>
                    <p>Unlock premium tools, get a verified profile badge, and enjoy an ad-free experience. Follow the steps below to join.</p>
                </AlertDescription>
            </Alert>
            
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Step 1: Choose Payment Method</h3>
                     <RadioGroup onValueChange={(id) => setSelectedMethod(paymentMethods.find(m => m.id === id) || null)} value={selectedMethod?.id || ''}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {isLoadingMethods ? (
                                Array.from({ length: 6 }).map((_, i) => <PaymentMethodSkeleton key={i} />)
                            ) : (
                                paymentMethods.map(method => (
                                    <Label 
                                        key={method.id}
                                        htmlFor={method.id}
                                        className="flex flex-col items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors data-[state=checked]:border-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                                    >
                                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                                        <Image src={method.icon} alt={method.name} width={64} height={64} className="h-10 w-auto object-contain" />
                                        <span className="text-sm font-medium">{method.name}</span>
                                    </Label>
                                ))
                            )}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {selectedMethod && (
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Step 2: Send Payment via {selectedMethod.name}</h3>
                        {selectedMethod.isLink ? (
                            <>
                                <p className="text-sm text-muted-foreground">Click the button below to pay <strong>{PAYMENT_COST}</strong> using {selectedMethod.name}.</p>
                                <Button asChild className="w-full">
                                    <a href={selectedMethod.paymentLink} target="_blank" rel="noopener noreferrer">
                                        Pay with {selectedMethod.name} <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">Please send <strong>{PAYMENT_COST}</strong> to the number below using the "{selectedMethod.name}" app.</p>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                   <span className="text-lg font-mono font-bold text-primary flex-grow">{selectedMethod.accountNumber}</span>
                                   <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(selectedMethod.accountNumber || '')}>
                                        <Copy className="h-4 w-4" />
                                   </Button>
                                </div>
                            </>
                        )}
                         <Alert variant="default" className="border-blue-200 dark:border-blue-800">
                            <Check className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800 dark:text-blue-300">Important!</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-400">
                                After sending the payment, make sure to save the <strong>Transaction ID</strong>. You will need it for the next step.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            )}
           
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Step 3: Submit for Verification</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Transaction ID</Label>
                            <Input
                                id="transactionId"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter the transaction ID from your payment"
                                required
                                disabled={!selectedMethod}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting || !transactionId || !selectedMethod}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit for Verification
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

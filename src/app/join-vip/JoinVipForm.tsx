
'use client';

import { useState } from 'react';
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
import Link from 'next/link';

const paymentMethods = [
    { name: 'bKash', icon: 'https://paylogo.pages.dev/bkash.png' },
    { name: 'Nagad', icon: 'https://paylogo.pages.dev/nagad.jpg' },
    { name: 'Rocket', icon: 'https://paylogo.pages.dev/rocket.png' },
    { name: 'Upay', icon: 'https://paylogo.pages.dev/upay.png' },
    { name: 'PathaoPay', icon: 'https://paylogo.pages.dev/pathaopay.png', isLink: true, link: 'https://pathaopay.me/@helloanaroul/500' },
    { name: 'CellFin', icon: 'https://paylogo.pages.dev/cellfin.png' },
];

const PAYMENT_NUMBER = '01964638683';

interface JoinVipFormProps {
    onSuccessfulSubmit: () => void;
}

export default function JoinVipForm({ onSuccessfulSubmit }: JoinVipFormProps) {
    const { user } = useAuth();
    const [transactionId, setTransactionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const { toast } = useToast();

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(PAYMENT_NUMBER);
        toast({
            title: 'Number Copied!',
            description: `${PAYMENT_NUMBER} has been copied to your clipboard.`,
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !transactionId) return;

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

    const currentMethod = paymentMethods.find(m => m.name === selectedMethod);

    return (
        <div className="space-y-6">
            <Alert>
                <Wallet className="h-4 w-4" />
                <AlertTitle>Become a VIP Member for 500 BDT!</AlertTitle>
                <AlertDescription>
                    <p>Unlock premium tools, get a verified profile badge, and enjoy an ad-free experience. Follow the steps below to join.</p>
                </AlertDescription>
            </Alert>
            
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Choose Payment Method</h3>
                     <RadioGroup onValueChange={setSelectedMethod} value={selectedMethod || ''}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {paymentMethods.map(method => (
                                <Label 
                                    key={method.name}
                                    htmlFor={method.name}
                                    className="flex flex-col items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors data-[state=checked]:border-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                                >
                                    <RadioGroupItem value={method.name} id={method.name} className="sr-only" />
                                    <Image src={method.icon} alt={method.name} width={64} height={64} className="h-10 w-auto object-contain" />
                                    <span className="text-sm font-medium">{method.name}</span>
                                </Label>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {selectedMethod && (
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Send Payment via {selectedMethod}</h3>
                        {currentMethod?.isLink ? (
                            <>
                                <p className="text-sm text-muted-foreground">Click the button below to pay <strong>500 BDT</strong> using PathaoPay.</p>
                                <Button asChild className="w-full">
                                    <a href={currentMethod.link} target="_blank" rel="noopener noreferrer">
                                        Pay with PathaoPay <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">Please send <strong>500 BDT</strong> to the number below using the "{selectedMethod}" app.</p>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                   <span className="text-lg font-mono font-bold text-primary flex-grow">{PAYMENT_NUMBER}</span>
                                   <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
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
                    <h3 className="font-semibold text-lg mb-4">Submit for Verification</h3>
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

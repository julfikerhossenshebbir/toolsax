
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';
import AdSubmissionForm from './AdSubmissionForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Advertise With Us | Toolsax',
    description: 'Submit your advertisement to be featured on Toolsax.',
};

export default function AdvertisePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Advertise With Us</CardTitle>
                    <CardDescription>
                        Reach a wide audience of developers, designers, and tech enthusiasts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-6">
                        <Phone className="h-4 w-4" />
                        <AlertTitle>Payment Information</AlertTitle>
                        <AlertDescription>
                            Please send your payment to our bKash/Nagad/Rocket number: <strong className="font-semibold">01964638683</strong>.
                            After sending the payment, please fill out the form below with your transaction details.
                        </AlertDescription>
                    </Alert>
                    <AdSubmissionForm />
                </CardContent>
            </Card>
        </div>
    );
}

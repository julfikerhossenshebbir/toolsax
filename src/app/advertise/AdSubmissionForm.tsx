
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { submitAdAction } from './actions';
import Image from 'next/image';

const formSchema = z.object({
  advertiserName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(11, { message: 'Please enter a valid phone number.' }),
  linkUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  image: z.any().refine(file => file instanceof File, { message: 'Image is required.' }),
  paymentMethod: z.enum(['bKash', 'Nagad', 'Rocket'], { required_error: 'You need to select a payment method.' }),
  transactionId: z.string().min(5, { message: 'Transaction ID is required.' }),
});

export default function AdSubmissionForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      advertiserName: '',
      phone: '',
      linkUrl: 'https://',
      transactionId: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not Logged In', description: 'You must be logged in to submit an ad.' });
        router.push('/login?redirect=/advertise');
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', values.image);
    formData.append('advertiserName', values.advertiserName);
    formData.append('phone', values.phone);
    formData.append('linkUrl', values.linkUrl);
    formData.append('paymentMethod', values.paymentMethod);
    formData.append('transactionId', values.transactionId);
    
    const result = await submitAdAction(formData);

    if (result.success) {
      toast({
        title: 'Ad Submitted!',
        description: "Thank you for your submission. We will review your ad shortly.",
      });
      form.reset();
      setPreview(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.error || 'An unknown error occurred. Please try again.',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="advertiserName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name / Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 01xxxxxxxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Link/URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
               <FormDescription>This is where users will be redirected when they click your ad.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad Image</FormLabel>
              <FormControl>
                <div 
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <Image src={preview} alt="Image preview" width={200} height={100} className="rounded-md object-cover" />
                    ) : (
                        <>
                            <UploadCloud className="w-10 h-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag & drop</p>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" className="hidden" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="bKash" />
                        </FormControl>
                        <FormLabel className="font-normal">bKash</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Nagad" />
                        </FormControl>
                        <FormLabel className="font-normal">Nagad</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Rocket" />
                        </FormControl>
                        <FormLabel className="font-normal">Rocket</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID (TrxID)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 9A4B1CDEFG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Ad
        </Button>
      </form>
    </Form>
  );
}

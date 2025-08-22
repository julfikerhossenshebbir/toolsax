
'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  checkAndCreateUser,
  isUsernameAvailable,
  signInWithGoogle,
  signInWithGithub,
  signInWithFacebook
} from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { CountrySelect } from '@/components/country-select';
import { Loader2, Eye, EyeOff, Check, X, ArrowLeft, PartyPopper, Calendar as CalendarIcon, Upload, Scissors, User as UserIcon, Github, Facebook } from 'lucide-react';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Link from 'next/link';
import type { User } from 'firebase/auth';

// --- Helper Functions & Schemas ---

const stepOneSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const stepTwoSchema = z.object({
  name: z.string().min(1, { message: 'Name cannot be empty.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).regex(/^[a-z0-9_.]+$/, { message: 'Username can only contain lowercase letters, numbers, underscores, and dots.' }),
});

const stepThreeSchema = z.object({
  photoURL: z.string().optional(),
});

const stepFourSchema = z.object({
  phone: z.string().optional(),
  country: z.string().optional(),
  dob: z.date().optional(),
});

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    )
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0, 0, crop.width, crop.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => { resolve(blob); }, 'image/png', 1);
  });
}

async function uploadToImgBB(imageFile: File | Blob): Promise<string | null> {
    const apiKey = "81b8c0708e71005a41112b81b0c0375b";
    if (!apiKey) {
        console.error("imgbb API key is not set.");
        return null;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            return result.data.url;
        } else {
            console.error("imgbb upload failed:", result.error.message);
            return null;
        }
    } catch (error) {
        console.error("Error uploading to imgbb:", error);
        return null;
    }
}


// --- Main Component ---

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const router = useRouter();
    const { toast } = useToast();

    const handleNext = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(prev => prev + 1);
    };

    const handlePrev = () => {
        setStep(prev => prev - 1);
    };

    const handleFinalSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };
        try {
            await checkAndCreateUser(finalData);
            setStep(prev => prev + 1); // Go to success step
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
        }
    };
    
    const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
      try {
        let authPromise;
        if(provider === 'google') authPromise = signInWithGoogle();
        if(provider === 'github') authPromise = signInWithGithub();
        if(provider === 'facebook') authPromise = signInWithFacebook();
        
        const result = await authPromise;
        const user = result.user;

        // Pre-fill form data from social provider
        const initialData = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid, // Pass UID for linking
          isSocial: true, // Flag for social sign up
        };
        
        setFormData(initialData);
        setStep(2); // Skip email/password step
        
      } catch (error: any) {
         toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
      }
    };

    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="container mx-auto flex min-h-full flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader>
                    {step < totalSteps && (
                        <Progress value={progress} className="w-full h-2 mb-4" />
                    )}
                    <div className="flex items-center gap-4">
                        {step > 1 && step < totalSteps && (
                            <Button variant="ghost" size="icon" onClick={handlePrev} className="h-7 w-7">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <div>
                            <CardTitle>Create an Account</CardTitle>
                             <CardDescription>
                                {step < totalSteps ? `Step ${step} of ${totalSteps - 1}` : 'Registration Complete!'}
                             </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {step === 1 && <StepOne onNext={handleNext} onSocialLogin={handleSocialLogin} />}
                    {step === 2 && <StepTwo onNext={handleNext} defaultValues={formData} />}
                    {step === 3 && <StepThree onNext={handleNext} defaultValues={formData} />}
                    {step === 4 && <StepFour onFinalSubmit={handleFinalSubmit} />}
                    {step === 5 && <SuccessStep onFinish={() => router.push('/profile')} />}
                </CardContent>
            </Card>
        </div>
    );
}


// --- Step Components ---

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 11.8 244 11.8c70.3 0 129.8 27.8 174.4 72.4l-69.3 67.4c-24.5-23.2-57.3-39.6-94.9-39.6-70.9 0-129.2 58.6-129.2 130.3 0 71.8 58.3 130.3 129.2 130.3 79.3 0 113.3-34.4 117.1-52.1H244v-83.3h235.1c4.4 24.1 7.4 50.8 7.4 79.3z"></path></svg>
);


function StepOne({ onNext, onSocialLogin }: { onNext: (data: any) => void, onSocialLogin: (p: 'google' | 'github' | 'facebook') => void }) {
  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => onSocialLogin('google')}><GoogleIcon /> Google</Button>
          <Button variant="outline" onClick={() => onSocialLogin('github')}><Github className="mr-2 h-4 w-4"/> GitHub</Button>
          <Button variant="outline" onClick={() => onSocialLogin('facebook')}><Facebook className="mr-2 h-4 w-4"/> Facebook</Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with email</span></div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><Label>Email</Label><FormControl><Input placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} {...field} />
                <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            <FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><Label>Confirm Password</Label><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </Form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}

function StepTwo({ onNext, defaultValues }: { onNext: (data: any) => void; defaultValues: any }) {
  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { name: defaultValues.name || '', username: defaultValues.username || '' },
  });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheck = useCallback(debounce(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      setIsCheckingUsername(false);
      return;
    }
    const available = await isUsernameAvailable(username);
    setUsernameStatus(available ? 'available' : 'taken');
    if (!available) {
      form.setError('username', { type: 'manual', message: 'This username is already taken.' });
    } else {
      form.clearErrors('username');
    }
    setIsCheckingUsername(false);
  }, 500), []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.toLowerCase();
    form.setValue('username', username, { shouldValidate: true });
    setUsernameStatus('idle');
    if (username.length >= 3) {
        setIsCheckingUsername(true);
        debouncedCheck(username);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4 pt-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><Label>Full Name</Label><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem><Label>Username</Label>
          <div className="relative">
             <FormControl><Input placeholder="johndoe" {...field} onChange={handleUsernameChange} /></FormControl>
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {usernameStatus === 'available' && <Check className="h-5 w-5 text-green-500" />}
                {usernameStatus === 'taken' && <X className="h-5 w-5 text-red-500" />}
              </div>
          </div>
          <FormMessage /></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={usernameStatus !== 'available'}>Continue</Button>
      </form>
    </Form>
  );
}

function StepThree({ onNext, defaultValues }: { onNext: (data: any) => void; defaultValues: any }) {
    const [imgSrc, setImgSrc] = useState(defaultValues.photoURL || '');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    };
    
    const handleCropAndContinue = async () => {
        setIsSaving(true);
        let photoURL = defaultValues.photoURL;
        if (completedCrop && imgRef.current) {
            try {
                const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
                if (!croppedImageBlob) throw new Error("Could not crop image.");
                
                const uploadedUrl = await uploadToImgBB(croppedImageBlob);

                if (uploadedUrl) {
                    photoURL = uploadedUrl;
                } else {
                    throw new Error("Image upload failed.");
                }
            } catch (error: any) {
                // handle error, maybe show a toast
                console.error(error);
            }
        }
        setIsSaving(false);
        onNext({ photoURL });
    };

    return (
        <div className="space-y-4 pt-4 text-center">
            <Label>Profile Picture (Optional)</Label>
            <Avatar className="h-32 w-32 mx-auto">
                <AvatarImage src={imgSrc} alt="Profile preview" />
                <AvatarFallback className="text-5xl"><UserIcon /></AvatarFallback>
            </Avatar>
            <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" className="mx-auto" />
            
            {imgSrc && !completedCrop && (
                 <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                >
                    <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '400px' }} />
                </ReactCrop>
            )}

            <div className="flex gap-2 justify-center">
                <Button onClick={() => onNext({ photoURL: defaultValues.photoURL })} variant="link">Skip</Button>
                <Button onClick={handleCropAndContinue} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                </Button>
            </div>
        </div>
    );
}

function StepFour({ onFinalSubmit }: { onFinalSubmit: (data: any) => void; }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof stepFourSchema>>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: { phone: '', country: '', dob: undefined },
  });
  
  const handleSubmit = async (data: z.infer<typeof stepFourSchema>) => {
      setIsLoading(true);
      await onFinalSubmit(data);
      setIsLoading(false);
  }
  
  const handleSkip = async () => {
      setIsLoading(true);
      await onFinalSubmit({});
      setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><Label>Phone Number (Optional)</Label><FormControl><Input type="tel" placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="dob" render={({ field }) => (
          <FormItem className="flex flex-col"><Label>Date of birth (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={!field.value && "text-muted-foreground"}>
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
              </PopoverContent>
            </Popover>
          <FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="country" render={({ field }) => (
          <FormItem><Label>Country (Optional)</Label><CountrySelect onValueChange={field.onChange} defaultValue={field.value} /><FormMessage /></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finish Sign Up'}
        </Button>
        <Button type="button" variant="link" className="w-full" onClick={handleSkip} disabled={isLoading}>Skip for now</Button>
      </form>
    </Form>
  );
}

function SuccessStep({ onFinish }: { onFinish: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full">
                <PartyPopper className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to Toolsax!</h2>
            <p className="text-muted-foreground">Your account has been created successfully. You can now explore all our tools.</p>
            <Button onClick={onFinish} className="w-full">
                Start Exploring
            </Button>
        </div>
    )
}

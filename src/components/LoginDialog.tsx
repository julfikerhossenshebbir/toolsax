
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  checkAndCreateUser,
  saveUserToDatabase,
  isUsernameAvailable,
} from '@/lib/firebase';
import { Loader2, Eye, EyeOff, Wand2, Check, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { debounce } from 'lodash';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

const signupSchema = z.object({
  name: z.string().min(1, { message: 'Name cannot be empty.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).regex(/^[a-z0-9_.]+$/, { message: 'Username can only contain lowercase letters, numbers, underscores, and dots.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

interface LoginDialogProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ children, open, onOpenChange }: LoginDialogProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential.user) {
        await saveUserToDatabase(userCredential.user);
      }
      onOpenChange(false); // Close dialog on success
      toast({ title: 'Successfully signed in with Google!' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.code === 'auth/popup-closed-by-user' ? 'The sign-in popup was closed.' : error.message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const content = (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Toolsax</DialogTitle>
          <DialogDescription>
            Log in or create an account to save your favorite tools.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <EmailForm
              schema={loginSchema}
              onSubmit={(email, password) => signInWithEmail(email, password)}
              buttonText="Log In"
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
          
          {/* Signup Tab */}
          <TabsContent value="signup">
            <SignupForm
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 11.8 244 11.8c70.3 0 129.8 27.8 174.4 72.4l-69.3 67.4c-24.5-23.2-57.3-39.6-94.9-39.6-70.9 0-129.2 58.6-129.2 130.3 0 71.8 58.3 130.3 129.2 130.3 79.3 0 113.3-34.4 117.1-52.1H244v-83.3h235.1c4.4 24.1 7.4 50.8 7.4 79.3z"></path></svg>
          )}
          Google
        </Button>
      </DialogContent>
  );

  // If children are provided, wrap them in a trigger.
  if (children) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {content}
        </Dialog>
    );
  }

  // If no children, it's a controlled dialog.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {content}
    </Dialog>
  );
}


// Reusable form for Email/Password Login
interface EmailFormProps {
    schema: z.AnyZodObject;
    onSubmit: (email: string, pass: string) => Promise<any>;
    buttonText: string;
    onSuccess: () => void;
}

function EmailForm({ schema, onSubmit, buttonText, onSuccess }: EmailFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '' },
    });

    const handleAuthAction = async (values: z.infer<typeof schema>) => {
        setIsLoading(true);
        try {
            await onSubmit(values.email, values.password);
            onSuccess();
            toast({ title: `Successfully ${buttonText.toLowerCase()}!`, description: "Welcome!" });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: `${buttonText} Failed`,
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuthAction)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="email-login">Email</Label>
                            <Input id="email-login" placeholder="m@example.com" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="password-login">Password</Label>
                            <div className="relative">
                                <Input id="password-login" type={showPassword ? 'text' : 'password'} {...field} />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">Toggle password visibility</span>
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {buttonText}
                </Button>
            </form>
        </Form>
    )
}

// Signup Form
function SignupForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');

    const { toast } = useToast();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: '', username: '', email: '', password: '' },
    });
    
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
        const username = e.target.value;
        form.setValue('username', username, { shouldValidate: true });
        setUsernameStatus('idle');
        if (username.length >= 3) {
            setIsCheckingUsername(true);
            debouncedCheck(username);
        }
    };
    
    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let pass = "";
        for (let i = 0; i < 16; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        form.setValue('password', pass, { shouldValidate: true });
        toast({ title: "Password Generated!", description: "A new secure password has been generated and filled in."});
    };

    const handleSignup = async (values: z.infer<typeof signupSchema>) => {
        setIsLoading(true);
        try {
            if (usernameStatus !== 'available') {
                throw new Error("Username is not available.");
            }
            await checkAndCreateUser(values);
            onSuccess();
            toast({ title: `Successfully signed up!`, description: "Welcome!" });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: `Sign Up Failed`,
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4 pt-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><Label>Name</Label><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem>
                        <Label>Username</Label>
                        <div className="relative">
                            <FormControl>
                                <Input placeholder="johndoe" {...field} onChange={handleUsernameChange} />
                            </FormControl>
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                                {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                {usernameStatus === 'available' && <Check className="h-5 w-5 text-green-500" />}
                                {usernameStatus === 'taken' && <X className="h-5 w-5 text-red-500" />}
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><Label>Email</Label><FormControl><Input placeholder="m@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <Label>Password</Label>
                        <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} {...field} />
                             <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={generatePassword}
                                >
                                    <Wand2 className="h-4 w-4" />
                                    <span className="sr-only">Generate password</span>
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">Toggle password visibility</span>
                                </Button>
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isLoading || usernameStatus !== 'available'}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                </Button>
            </form>
        </Form>
    )
}

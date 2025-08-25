
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmail, signInWithGoogle, signInWithGithub, signInWithFacebook, getUserData } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Eye, EyeOff, Github, Facebook } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.5 109.8 11.8 244 11.8c70.3 0 129.8 27.8 174.4 72.4l-69.3 67.4c-24.5-23.2-57.3-39.6-94.9-39.6-70.9 0-129.2 58.6-129.2 130.3 0 71.8 58.3 130.3 129.2 130.3 79.3 0 113.3-34.4 117.1-52.1H244v-83.3h235.1c4.4 24.1 7.4 50.8 7.4 79.3z"></path></svg>
);

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      await signInWithEmail(values.email, values.password);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/profile');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
      setIsSubmitting(true);
      try {
        let authPromise;
        if(provider === 'google') authPromise = signInWithGoogle();
        if(provider === 'github') authPromise = signInWithGithub();
        if(provider === 'facebook') authPromise = signInWithFacebook();
        
        const result = await authPromise;
        const user = result.user;

        // Check if user exists in the database
        const userData = await getUserData(user.uid);

        if (!userData || !userData.username) {
             // New user or incomplete profile, redirect to signup to complete profile
            toast({ title: 'Welcome! Please complete your profile.' });
            router.push('/signup');
        } else {
             // Existing user, redirect to profile
            toast({ title: 'Login Successful', description: `Welcome back, ${user.displayName}!` });
            router.push('/profile');
        }
        
      } catch (error: any) {
         toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="container mx-auto flex min-h-full flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Log in to your Toolsax account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input type={showPassword ? 'text' : 'password'} placeholder="Your password" {...field} />
                        </FormControl>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
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
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isSubmitting}><GoogleIcon /> Google</Button>
            <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isSubmitting}><Github className="mr-2 h-4 w-4"/> GitHub</Button>
            <Button variant="outline" onClick={() => handleSocialLogin('facebook')} disabled={isSubmitting}><Facebook className="mr-2 h-4 w-4"/> Facebook</Button>
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}

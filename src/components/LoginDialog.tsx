
'use client';

import { useState } from 'react';
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
} from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

interface LoginDialogProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ children, open, onOpenChange }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
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
              onSubmit={signInWithEmail}
              buttonText="Log In"
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
          
          {/* Signup Tab */}
          <TabsContent value="signup">
            <EmailForm
              schema={signupSchema}
              onSubmit={signUpWithEmail}
              buttonText="Sign Up"
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
        <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
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


// Reusable form for Email/Password
interface EmailFormProps {
    schema: z.AnyZodObject;
    onSubmit: (email: string, pass: string) => Promise<any>;
    buttonText: string;
    onSuccess: () => void;
}

function EmailForm({ schema, onSubmit, buttonText, onSuccess }: EmailFormProps) {
    const [isLoading, setIsLoading] = useState(false);
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
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="m@example.com" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...field} />
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

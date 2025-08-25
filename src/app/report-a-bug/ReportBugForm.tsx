
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tool, UserData } from '@/lib/types';
import { submitBugReportAction } from '@/app/admin/dashboard/actions';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


const formSchema = z.object({
  tool: z.string().min(1, { message: 'Please select a tool.' }),
  description: z.string().min(10, { message: 'Please provide a detailed description of at least 10 characters.' }),
});

export default function ReportBugForm({ tools }: { tools: Tool[] }) {
  const searchParams = useSearchParams();
  const defaultTool = searchParams.get('tool') || '';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tool: defaultTool,
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to submit a bug report.'});
        return;
    }

    setIsSubmitting(true);
    const result = await submitBugReportAction({
        ...values,
        user: {
            uid: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email || 'No email'
        }
    });

    if (result.success) {
      toast({
        title: 'Report Sent!',
        description: "Thank you for your feedback. We'll look into it shortly.",
      });
      form.reset();
      // Reset to default tool if it was present
      form.setValue('tool', defaultTool);

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
          name="tool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool with an issue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tool" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bug Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe the bug in detail. What did you expect to happen, and what happened instead?"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Report
        </Button>
      </form>
    </Form>
  );
}

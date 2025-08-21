
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postComment, postReply } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import CommentAvatar from './CommentAvatar';
import LoginDialog from '../LoginDialog';

interface CommentFormProps {
  toolId: string;
  commentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  isReply?: boolean;
}

export default function CommentForm({
  toolId,
  commentId,
  onSuccess,
  placeholder = 'Add a comment...',
  isReply = false,
}: CommentFormProps) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      if (isReply && commentId) {
        await postReply(toolId, commentId, text, user);
      } else {
        await postComment(toolId, text, user);
      }
      setText('');
      toast({ title: isReply ? 'Reply posted!' : 'Comment posted!' });
      onSuccess?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error posting comment',
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
        <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                    You must be logged in to comment.
                </p>
                <Button variant="link" onClick={() => setIsLoginOpen(true)}>
                    Log in or Sign up
                </Button>
            </div>
        </LoginDialog>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      {!isReply && <CommentAvatar user={user} />}
      <div className="flex-1 space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="min-h-[60px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isReply ? 'Post Reply' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
}

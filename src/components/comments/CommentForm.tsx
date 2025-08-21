
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postComment, postReply, updateComment, updateReply } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import CommentAvatar from './CommentAvatar';
import LoginDialog from '../LoginDialog';

interface CommentFormProps {
  toolId: string;
  commentId?: string;
  replyId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  isReply?: boolean;
  isEditing?: boolean;
  initialText?: string;
}

export default function CommentForm({
  toolId,
  commentId,
  replyId,
  onSuccess,
  placeholder = 'Add a comment...',
  isReply = false,
  isEditing = false,
  initialText = '',
}: CommentFormProps) {
  const { user } = useAuth();
  const [text, setText] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing) {
        setText(initialText);
    }
  }, [isEditing, initialText]);

  const handleSubmit = async () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
        if(isEditing) {
            if (isReply && commentId && replyId) {
                await updateReply(toolId, commentId, replyId, text, user);
            } else if (commentId) {
                await updateComment(toolId, commentId, text, user);
            }
            toast({ title: isReply ? 'Reply updated!' : 'Comment updated!' });
        } else {
            if (isReply && commentId) {
                await postReply(toolId, commentId, text, user);
            } else {
                await postComment(toolId, text, user);
            }
            toast({ title: isReply ? 'Reply posted!' : 'Comment posted!' });
        }
      
      setText('');
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Please try again later.',
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
          autoFocus={isEditing}
        />
        <div className="flex justify-end gap-2">
          {isEditing && (
            <Button variant="ghost" onClick={onSuccess}>Cancel</Button>
          )}
          <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save' : (isReply ? 'Post Reply' : 'Post Comment')}
          </Button>
        </div>
      </div>
    </div>
  );
}

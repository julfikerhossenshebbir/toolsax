
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postComment, postReply, updateComment, updateReply } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Check, X, CornerUpLeft } from 'lucide-react';
import CommentAvatar from './CommentAvatar';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';

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
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isEditing) {
        setText(initialText);
    }
  }, [isEditing, initialText]);
  
  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleSubmit = async () => {
    if (!user) {
      handleLoginRedirect();
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
            toast({ title: isReply ? 'Comment posted!' : 'Comment posted!' });
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
  
  if (!user && !isReply && !isEditing) {
    return (
        <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">
                You must be logged in to comment.
            </p>
            <Button variant="link" onClick={handleLoginRedirect}>
                Log in or Sign up
            </Button>
        </div>
    );
  }
  
  if (isReply && !user) {
      return (
          <Button variant="link" onClick={handleLoginRedirect}>
                <CornerUpLeft className="mr-2 h-4 w-4" />
                Log in to reply
          </Button>
      )
  }

  const formContent = (
    <div className="flex gap-3 items-center w-full">
      <CommentAvatar user={user} />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-grow bg-muted border-transparent focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary"
        autoFocus={isEditing}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        }}
      />
      <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim()} size="icon">
        {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Publish</span>
      </Button>
    </div>
  );

  if (isEditing) {
      return (
         <div className="flex-1 space-y-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              autoFocus={isEditing}
               onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                  }
               }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onSuccess}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim()}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Check className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
         </div>
      );
  }

  return formContent;
}

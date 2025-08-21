
'use client';

import { useState, useEffect } from 'react';
import type { Comment as CommentType, Reply } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import CommentForm from './CommentForm';
import CommentAvatar from './CommentAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData, deleteComment, deleteReply } from '@/lib/firebase';
import { MoreHorizontal, Pencil, Trash2, BadgeCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface CommentProps {
  comment: CommentType;
  toolId: string;
  onCommentDeleted: (commentId: string) => void;
}

const CommentActions = ({ authorId, onEdit, onDelete }: { authorId: string, onEdit: () => void, onDelete: () => void }) => {
    const { user } = useAuth();
    if (!user || user.uid !== authorId) return null;

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your comment.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


const ReplyItem = ({ reply, toolId, commentId, onReplyDeleted }: { reply: Reply; toolId: string; commentId: string, onReplyDeleted: (replyId: string) => void; }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [authorRole, setAuthorRole] = useState<'user' | 'admin' | null>(null);

     useEffect(() => {
        if (reply.uid) {
            getUserData(reply.uid).then(data => {
                if (data && data.role) {
                    setAuthorRole(data.role);
                }
            });
        }
    }, [reply.uid]);

    const handleDelete = async () => {
        try {
            await deleteReply(toolId, commentId, reply.id);
            toast({ title: "Reply deleted!" });
            onReplyDeleted(reply.id);
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error deleting reply", description: error.message });
        }
    };

    return (
        <div className="flex gap-3">
            <CommentAvatar user={{ name: reply.authorName, photoURL: reply.authorPhotoURL }} />
            <div className="flex-1">
                {isEditing ? (
                    <CommentForm
                        toolId={toolId}
                        commentId={commentId}
                        isReply
                        isEditing
                        initialText={reply.text}
                        replyId={reply.id}
                        onSuccess={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <div className="bg-muted rounded-lg p-3">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm flex items-center gap-1.5">
                                    {reply.authorName}
                                    {authorRole === 'admin' && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                                  </p>
                                </div>
                                <CommentActions authorId={reply.uid} onEdit={() => setIsEditing(true)} onDelete={handleDelete} />
                             </div>
                             <p className="text-sm mt-1 whitespace-pre-wrap">{reply.text}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


export default function Comment({ comment, toolId, onCommentDeleted }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [authorRole, setAuthorRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    if (comment.uid) {
        getUserData(comment.uid).then(data => {
            if (data && data.role) {
                setAuthorRole(data.role);
            }
        });
    }
  }, [comment.uid]);

  const handleDelete = async () => {
    if (!user || user.uid !== comment.uid) return;
    try {
        await deleteComment(toolId, comment.id);
        toast({ title: "Comment deleted!" });
        onCommentDeleted(comment.id);
    } catch(error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    }
  }

  return (
    <div className="flex flex-col p-4 border rounded-lg">
      <div className="flex gap-3">
        <CommentAvatar user={{ name: comment.authorName, photoURL: comment.authorPhotoURL }} />
        <div className="flex-1">
            {isEditing ? (
                 <CommentForm
                    toolId={toolId}
                    isEditing
                    initialText={comment.text}
                    commentId={comment.id}
                    onSuccess={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm flex items-center gap-1.5">
                            {comment.authorName}
                             {authorRole === 'admin' && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            added a comment {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        <CommentActions authorId={comment.uid} onEdit={() => setIsEditing(true)} onDelete={handleDelete} />
                    </div>
                    <p className="text-sm mt-2 whitespace-pre-wrap">{comment.text}</p>
                </>
            )}
          <div className="mt-2">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => setShowReplyForm(!showReplyForm)}>
              {showReplyForm ? 'Cancel Reply' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="pl-12 pt-4">
          <CommentForm
            toolId={toolId}
            commentId={comment.id}
            onSuccess={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
            isReply
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-12 pt-4 space-y-4">
          {comment.replies.map((reply) => (
            <ReplyItem 
                key={reply.id} 
                reply={reply} 
                toolId={toolId}
                commentId={comment.id}
                onReplyDeleted={(replyId) => {
                    // This is a simplistic update. For a more robust solution,
                    // you'd re-fetch comments or manage state more centrally.
                    comment.replies = comment.replies.filter(r => r.id !== replyId);
                }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

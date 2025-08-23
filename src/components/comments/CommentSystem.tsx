
'use client';

import { useState, useEffect } from 'react';
import type { Comment as CommentType, Reply } from '@/lib/types';
import { getComments } from '@/lib/firebase';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSystemProps {
  toolId: string;
  toolName: string;
}

function CommentSkeleton() {
    return (
        <div className="flex items-start space-x-3 p-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}

export default function CommentSystem({ toolId, toolName }: CommentSystemProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getComments(toolId, (loadedComments) => {
      setComments(loadedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toolId]);

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }

  const handleReplyUpdated = (commentId: string, updatedReplies: Reply[]) => {
      setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, replies: updatedReplies } : c
      ));
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
      <h2 className="text-xl font-bold">Comments on {toolName} ({comments.length})</h2>
      <CommentForm toolId={toolId} />
      
      <div className="space-y-6">
        {loading ? (
            <div className="space-y-4">
                <CommentSkeleton />
                <CommentSkeleton />
            </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment 
                key={comment.id} 
                comment={comment} 
                toolId={toolId} 
                onCommentDeleted={handleCommentDeleted}
                onReplyUpdated={handleReplyUpdated}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}

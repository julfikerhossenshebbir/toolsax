
'use client';

import { useState, useEffect } from 'react';
import type { Comment as CommentType } from '@/lib/types';
import { getComments } from '@/lib/firebase';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSystemProps {
  toolId: string;
}

function CommentSkeleton() {
    return (
        <div className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

export default function CommentSystem({ toolId }: CommentSystemProps) {
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

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
      <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
      <CommentForm toolId={toolId} />
      
      <div className="space-y-6">
        {loading ? (
            <div className="space-y-6">
                <CommentSkeleton />
                <CommentSkeleton />
            </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} toolId={toolId} onCommentDeleted={handleCommentDeleted} />
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


'use client';

import { useState } from 'react';
import type { Comment as CommentType, Reply } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import CommentForm from './CommentForm';
import CommentAvatar from './CommentAvatar';

interface CommentProps {
  comment: CommentType;
  toolId: string;
}

export default function Comment({ comment, toolId }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        <CommentAvatar user={{ name: comment.authorName, photoURL: comment.authorPhotoURL }} />
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{comment.authorName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
              </p>
            </div>
            <p className="text-sm mt-1">{comment.text}</p>
          </div>
          <div className="pl-3 mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowReplyForm(!showReplyForm)}>
              {showReplyForm ? 'Cancel' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="pl-12 mt-2">
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
        <div className="pl-12 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <CommentAvatar user={{ name: reply.authorName, photoURL: reply.authorPhotoURL }} />
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{reply.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm mt-1">{reply.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

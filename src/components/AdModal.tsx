'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function AdModal({ isOpen, onClose, onContinue }: AdModalProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10); // Reset countdown when modal opens
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup on close
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Advertisement</AlertDialogTitle>
          <AlertDialogDescription>
            Enjoy our free tools! Please take a moment to view this ad.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 rounded-md overflow-hidden">
            <Image
                src="https://placehold.co/400x200.png"
                alt="Advertisement"
                width={400}
                height={200}
                className="w-full h-auto object-cover"
                data-ai-hint="advertisement banner"
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onContinue} disabled={countdown > 0}>
            {countdown > 0 ? `Continue in ${countdown}s` : 'Continue to Tool'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

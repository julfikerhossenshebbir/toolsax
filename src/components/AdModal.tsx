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

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function AdModal({ isOpen, onClose, onContinue }: AdModalProps) {
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
          <AlertDialogAction onClick={onContinue}>
            Continue to Tool
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

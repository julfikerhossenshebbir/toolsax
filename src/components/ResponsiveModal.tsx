
'use client';

import * as React from 'react';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface ResponsiveModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function ResponsiveModal({ children, ...props }: ResponsiveModalProps) {
  const isDesktop = useIsDesktop();
  const ModalComponent = isDesktop ? Dialog : Drawer;
  return <ModalComponent {...props}>{children}</ModalComponent>;
}

export const ResponsiveModalTrigger = ({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) => {
    const isDesktop = useIsDesktop();
    const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;
    return <TriggerComponent {...props}>{children}</TriggerComponent>;
};

export const ResponsiveModalContent = ({ children, ...props }: React.ComponentProps<typeof DialogContent>) => {
    const isDesktop = useIsDesktop();
    const ContentComponent = isDesktop ? DialogContent : DrawerContent;
    return <ContentComponent {...props}>{children}</ContentComponent>;
};

export const ResponsiveModalHeader = ({ children, ...props }: React.ComponentProps<typeof DialogHeader>) => {
    const isDesktop = useIsDesktop();
    const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
    return <HeaderComponent {...props}>{children}</HeaderComponent>;
};

export const ResponsiveModalFooter = ({ children, ...props }: React.ComponentProps<typeof DialogFooter>) => {
    const isDesktop = useIsDesktop();
    const FooterComponent = isDesktop ? DialogFooter : DrawerFooter;
    return <FooterComponent {...props}>{children}</FooterComponent>;
};

export const ResponsiveModalTitle = ({ children, ...props }: React.ComponentProps<typeof DialogTitle>) => {
    const isDesktop = useIsDesktop();
    const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;
    return <TitleComponent {...props}>{children}</TitleComponent>;
};

export const ResponsiveModalDescription = ({ children, ...props }: React.ComponentProps<typeof DialogDescription>) => {
    const isDesktop = useIsDesktop();
    const DescriptionComponent = isDesktop ? DialogDescription : DrawerDescription;
    return <DescriptionComponent {...props}>{children}</DescriptionComponent>;
};

export const ResponsiveModalClose = ({ children, ...props }: React.ComponentProps<typeof DialogClose>) => {
    const isDesktop = useIsDesktop();
    const CloseComponent = isDesktop ? DialogClose : DrawerClose;
    return <CloseComponent {...props}>{children}</CloseComponent>;
}

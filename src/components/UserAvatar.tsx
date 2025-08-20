
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { logout, getUserData } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon, Settings, Shield } from 'lucide-react';
import LoginDialog from './LoginDialog';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserAvatar() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
      const checkAdminStatus = async () => {
          if (user) {
              const userData = await getUserData(user.uid);
              if (userData?.role === 'admin') {
                  setIsAdmin(true);
              } else {
                  setIsAdmin(false);
              }
          } else {
              setIsAdmin(false);
          }
      };
      checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Logged out successfully.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout failed.',
        description: error.message,
      });
    }
  };

  if (loading) {
    return <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled><UserIcon className="h-5 w-5" /></Button>;
  }

  if (!user) {
    return (
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <Button variant="ghost" size="icon" onClick={() => setIsLoginOpen(true)}>
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">Login</span>
        </Button>
      </LoginDialog>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
            <DropdownMenuItem asChild>
                <Link href="/admin/dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </Link>
            </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

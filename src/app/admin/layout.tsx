
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getUserData } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, LayoutDashboard, Wrench, Users, Bell, PanelLeft, Crown, WalletCards, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import UserAvatar from '@/components/UserAvatar';

const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/tools', label: 'Tools', icon: Wrench },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/vip-requests', label: 'VIP Requests', icon: Crown },
    { href: '/admin/payment-methods', label: 'Payments', icon: WalletCards },
]

const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);
    return (
        <Link href={href}>
            <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start"
            >
                <Icon className="mr-2 h-4 w-4" />
                {label}
            </Button>
        </Link>
    );
};

const AdminSidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    return (
        <aside className="flex flex-col h-full bg-background w-full">
             <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="flex-grow p-2">
                <ul className="space-y-1">
                    {navLinks.map(link => (
                        <li key={link.href} onClick={onLinkClick}>
                            <NavLink {...link} />
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (loading) return;

            if (!user) {
                router.replace('/');
                return;
            }

            const userData = await getUserData(user.uid);
            if (userData?.role === 'admin') {
                setIsAdmin(true);
            } else {
                router.replace('/');
            }
            setIsChecking(false);
        };

        checkAdminStatus();

    }, [user, loading, router]);


    if (isChecking || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAdmin) {
        // This is a fallback, though the redirect should have already happened.
        return null;
    }
    
    const currentPage = navLinks.find(link => pathname.startsWith(link.href));

    return (
        <div className="flex min-h-screen bg-muted/40">
            <div className="hidden md:block w-64 border-r bg-background">
                <AdminSidebar />
            </div>
            <div className="flex flex-col flex-1">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                        <SheetTrigger asChild>
                             <Button size="icon" variant="ghost" className="sm:hidden">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[300px]">
                           <SheetHeader>
                             <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                           </SheetHeader>
                           <AdminSidebar onLinkClick={() => setIsMobileSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1">
                       <h1 className="font-semibold text-lg">{currentPage?.label || 'Dashboard'}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserAvatar />
                    </div>
                </header>
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}


'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getUserData } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, LayoutDashboard, Wrench, Megaphone, Users, Settings, Bell, PanelLeft, BotMessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserAvatar from '@/components/UserAvatar';

const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/tools', label: 'Tools', icon: Wrench },
    { href: '/admin/advertisements', label: 'Advertisements', icon: Megaphone },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
]

const NavLink = ({ href, label, icon: Icon, isMobile }: { href: string; label: string; icon: React.ElementType, isMobile?: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href}>
            <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full', isMobile ? 'justify-start' : 'justify-start')}
            >
                <Icon className="mr-2 h-4 w-4" />
                {label}
            </Button>
        </Link>
    );
};

const AdminSidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <aside className={cn("flex flex-col space-y-2 h-full", isMobile ? "w-full" : "w-64 p-4 border-r")}>
             <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="flex-grow p-4">
                <ul className="space-y-1">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <NavLink {...link} isMobile={isMobile}/>
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
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAdmin) {
        // This is a fallback, though the redirect should have already happened.
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:block">
                <AdminSidebar />
            </div>
            <main className="flex-1 p-4 md:p-8 bg-muted/40">
                <div className="md:hidden flex justify-between items-center mb-4">
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <PanelLeft className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                           <AdminSidebar isMobile={true} />
                        </SheetContent>
                    </Sheet>
                    <UserAvatar />
                </div>
                {children}
            </main>
        </div>
    );
}

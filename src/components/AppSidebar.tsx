
'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link";
import { Home, Bug, PanelLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
        <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const mainNavLinks = [
    { href: "/", icon: <Home />, label: "Home" },
    { href: "/report-a-bug", icon: <Bug />, label: "Report a Bug" },
];

export default function AppSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:h-10 md:w-10 h-8 w-8">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
                <SheetHeader className="border-b p-4">
                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                     <div className="flex items-center gap-2">
                        <Logo />
                        <span className="font-bold text-lg">Toolsax</span>
                    </div>
                </SheetHeader>
                <div className="p-4 flex-grow">
                    <nav className="flex flex-col gap-2">
                        {mainNavLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}

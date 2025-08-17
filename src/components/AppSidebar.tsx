import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { Home, Bug, FileText, ShieldCheck, Cookie, Send, Coffee } from "lucide-react";

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

const secondaryNavLinks = [
    { href: "/dmca", icon: <FileText />, label: "DMCA" },
    { href: "/privacy", icon: <ShieldCheck />, label: "Privacy Policy" },
    { href: "/cookies", icon: <Cookie />, label: "Cookie Policy" },
    { href: "/contact", icon: <Send />, label: "Contact" },
]


export default async function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <Logo />
                    <span className="font-bold text-lg">Toolsax</span>
                </div>
                <SidebarTrigger className="hidden md:flex" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {mainNavLinks.map(link => (
                        <SidebarMenuItem key={link.href}>
                            <Link href={link.href} className="w-full">
                                <SidebarMenuButton tooltip={link.label}>
                                    {link.icon}
                                    <span>{link.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

                <SidebarMenu className="mt-auto">
                     <SidebarMenuItem>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Policies</div>
                    </SidebarMenuItem>
                    {secondaryNavLinks.map(link => (
                        <SidebarMenuItem key={link.href}>
                            <Link href={link.href} className="w-full">
                                <SidebarMenuButton size="sm" tooltip={link.label}>
                                    {link.icon}
                                    <span>{link.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href="https://www.buymeacoffee.com/your-username" target="_blank" rel="noopener noreferrer" className="w-full">
                            <SidebarMenuButton tooltip="Buy me a Coffee">
                                <Coffee />
                                <span>Buy me a Coffee</span>
                            </SidebarMenuButton>
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

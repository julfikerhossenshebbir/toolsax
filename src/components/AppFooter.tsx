
import Link from 'next/link';
import { Github, Twitter, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Separator } from './ui/separator';

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
        <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const footerLinks = {
    tools: [
        { name: 'Image Tools', href: '#' },
        { name: 'PDF Tools', href: '#' },
        { name: 'Development Tools', href: '#' },
        { name: 'Content Tools', href: '#' },
        { name: 'SEO Tools', href: '#' },
        { name: 'All Tools', href: '/' }
    ],
    resources: [
        { name: 'Report a Bug', href: '/report-a-bug' },
        { name: 'Join VIP', href: '/join-vip' },
    ],
    company: [
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'DMCA Policy', href: '/dmca' },
    ],
    social: [
        { name: 'GitHub', href: '#', icon: <Github className="h-4 w-4" /> },
        { name: 'Twitter', href: '#', icon: <Twitter className="h-4 w-4" /> },
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="h-4 w-4" /> },
        { name: 'YouTube', href: '#', icon: <Youtube className="h-4 w-4" /> },
    ]
};

export default function AppFooter() {
    return (
        <footer className="bg-background border-t mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Tools */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Tools</h3>
                        <ul className="space-y-3">
                            {footerLinks.tools.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Social</h3>
                        <ul className="space-y-3">
                            {footerLinks.social.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Logo />
                       <span className="font-bold">Toolsax</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Toolsax. All Rights Reserved.</p>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </footer>
    )
}

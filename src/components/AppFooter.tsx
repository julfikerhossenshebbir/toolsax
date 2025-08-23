
import Link from 'next/link';
import { Github, Twitter, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import { Separator } from './ui/separator';
import SectionDivider from './SectionDivider';

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
        { name: 'GitHub', href: 'https://helloanaroul.pages.dev/github', icon: <Github className="h-4 w-4" /> },
        { name: 'Twitter', href: 'https://helloanaroul.pages.dev/twitter', icon: <Twitter className="h-4 w-4" /> },
        { name: 'LinkedIn', href: 'https://helloanaroul.pages.dev/linkedIn', icon: <Linkedin className="h-4 w-4" /> },
        { name: 'YouTube', href: 'https://helloanaroul.pages.dev/youtube', icon: <Youtube className="h-4 w-4" /> },
    ]
};

export default function AppFooter() {
    return (
        <footer className="bg-background mt-auto">
            <SectionDivider />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
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
            </div>
        </footer>
    )
}

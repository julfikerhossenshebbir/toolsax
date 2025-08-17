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
import { Tool } from "@/lib/types";
import fs from 'fs';
import path from 'path';
import Link from "next/link";
import Icon from "./Icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Github, Home } from "lucide-react";

async function getTools(): Promise<Tool[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'tools.json');
  const jsonData = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
        <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default async function AppSidebar() {
    const tools = await getTools();
    const categories = Array.from(new Set(tools.map(tool => tool.category))).sort();

    const groupedTools: { [key: string]: Tool[] } = {};
    categories.forEach(category => {
        groupedTools[category] = tools.filter(tool => tool.category === category);
    });

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
                    <SidebarMenuItem>
                        <Link href="/" className="w-full">
                            <SidebarMenuButton tooltip="Home">
                                <Home />
                                <span>Home</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
                <Accordion type="multiple" className="w-full px-2" defaultValue={categories}>
                    {categories.map(category => (
                        <AccordionItem value={category} key={category} className="border-none">
                            <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-2 rounded-md">
                                {category}
                            </AccordionTrigger>
                            <AccordionContent>
                                <SidebarMenu>
                                    {groupedTools[category].map(tool => (
                                        <SidebarMenuItem key={tool.id}>
                                            <Link href={`/${tool.id}`} className="w-full">
                                                <SidebarMenuButton size="sm" tooltip={tool.name}>
                                                    <Icon name={tool.icon} />
                                                    <span>{tool.name}</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="w-full">
                            <SidebarMenuButton tooltip="GitHub">
                                <Github />
                                <span>GitHub</span>
                            </SidebarMenuButton>
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

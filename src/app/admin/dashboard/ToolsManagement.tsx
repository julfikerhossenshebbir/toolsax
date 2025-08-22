
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { saveToolAction, deleteToolAction } from './actions';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Tool } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/Icon';
import { ALL_TOOLS } from '@/lib/tools';

const emptyTool: Tool = {
    id: '',
    name: '',
    description: '',
    link: '',
    category: 'Utilities',
    icon: 'Wrench',
    authRequired: false,
    isEnabled: true,
    order: 0,
    isPremium: false,
};

const toolCategories = [
    'Design', 'Development', 'Productivity', 'Marketing', 
    'Utilities', 'Security', 'Content', 'Image', 'PDF', 
    'Social Media', 'SEO'
];

interface ToolsManagementProps {
    initialTools: Tool[];
    isLoading: boolean;
}

export default function ToolsManagement({ initialTools, isLoading }: ToolsManagementProps) {
    const [tools, setTools] = useState<Tool[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentTool, setCurrentTool] = useState<Tool>(emptyTool);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setTools(initialTools);
    }, [initialTools]);

    const sortedTools = useMemo(() => {
        return [...tools].sort((a, b) => a.order - b.order);
    }, [tools]);
    
    const handleOpenSheet = (tool?: Tool) => {
        if (tool) {
            setCurrentTool(tool);
        } else {
            const newOrder = tools.length > 0 ? Math.max(...tools.map(t => t.order)) + 1 : 0;
            setCurrentTool({ ...emptyTool, id: uuidv4(), order: newOrder });
        }
        setIsSheetOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveToolAction(currentTool);
        if (result.success) {
            toast({ title: 'Tool Saved!', description: `${currentTool.name} has been saved successfully.` });
            setIsSheetOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
        }
        setIsSaving(false);
    };
    
    const handleDelete = async (toolId: string) => {
        const result = await deleteToolAction(toolId);
        if (result.success) {
            toast({ title: 'Tool Deleted!', description: `The tool has been permanently deleted.` });
        } else {
            toast({ variant: 'destructive', title: 'Delete Failed', description: result.error });
        }
    };
    
    const handleToggle = async (tool: Tool, isEnabled: boolean) => {
        const updatedTool = { ...tool, isEnabled };
        const result = await saveToolAction(updatedTool);
        if (!result.success) {
            toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
        }
    }

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Tools Management</CardTitle>
                        <CardDescription>Add, edit, and manage all available tools.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenSheet()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Tool
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <div>
                        {sortedTools.length > 0 ? sortedTools.map((tool) => (
                            <div
                                key={tool.id}
                                className='flex items-center justify-between p-3 border-b bg-card'
                            >
                                <div className="flex items-center gap-3 flex-grow">
                                    <Icon name={tool.icon} className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium truncate max-w-xs">{tool.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Switch
                                        checked={tool.isEnabled}
                                        onCheckedChange={(checked) => handleToggle(tool, checked)}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenSheet(tool)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(tool.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )) : (
                                <div className="p-12 text-center text-muted-foreground">No tools found.</div>
                        )}
                    </div>
                </div>
            </CardContent>

             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-lg w-full">
                    <SheetHeader>
                        <SheetTitle>{currentTool.id && tools.some(t => t.id === currentTool.id) ? 'Edit Tool' : 'Add New Tool'}</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4 max-h-[90vh] overflow-y-auto pr-4">
                        <div className="space-y-2">
                            <Label htmlFor="tool-name">Tool Name</Label>
                            <Input id="tool-name" value={currentTool.name} onChange={(e) => setCurrentTool({ ...currentTool, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tool-id">Tool ID / Link</Label>
                            <Input id="tool-id" value={currentTool.id} disabled={tools.some(t => t.id === currentTool.id)} onChange={(e) => setCurrentTool({ ...currentTool, id: e.target.value.toLowerCase().replace(/\s+/g, '-'), link: `/${e.target.value.toLowerCase().replace(/\s+/g, '-')}` })} placeholder="e.g., case-converter" />
                             <p className="text-xs text-muted-foreground">This cannot be changed after creation. Must be unique and URL-friendly.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tool-description">Description</Label>
                            <Textarea id="tool-description" value={currentTool.description} onChange={(e) => setCurrentTool({ ...currentTool, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tool-category">Category</Label>
                             <Select value={currentTool.category} onValueChange={(value) => setCurrentTool({ ...currentTool, category: value as Tool['category'] })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {toolCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tool-icon">Icon Name</Label>
                            <div className="flex items-center gap-2">
                                <Input id="tool-icon" value={currentTool.icon} onChange={(e) => setCurrentTool({ ...currentTool, icon: e.target.value })} placeholder="e.g., CaseUpper"/>
                                <Icon name={currentTool.icon} className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">Use any name from <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="auth-required" checked={currentTool.authRequired} onCheckedChange={(checked) => setCurrentTool({ ...currentTool, authRequired: !!checked })} />
                            <Label htmlFor="auth-required">Requires Authentication</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="is-premium" checked={currentTool.isPremium} onCheckedChange={(checked) => setCurrentTool({ ...currentTool, isPremium: !!checked })} />
                            <Label htmlFor="is-premium">VIP Only (Premium)</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="is-enabled" checked={currentTool.isEnabled} onCheckedChange={(checked) => setCurrentTool({ ...currentTool, isEnabled: checked })} />
                            <Label htmlFor="is-enabled">Tool is Enabled</Label>
                        </div>
                    </div>
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                        <div className="flex justify-end gap-2">
                             <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
                             <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Tool
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </Card>
    );
}

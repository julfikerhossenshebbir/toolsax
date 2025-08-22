
'use client';

import { useEffect, useState } from 'react';
import { getTools } from '@/lib/firebase';
import type { Tool } from '../types';
import ToolsManagement from '../dashboard/ToolsManagement';

export default function AdminToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getTools((loadedTools) => {
            setTools(loadedTools);
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Tools Management</h2>
            <p className="text-muted-foreground">Add, edit, disable, or reorder the tools available on your site. Mark tools as VIP-only.</p>
            <ToolsManagement initialTools={tools} isLoading={loading} />
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { listenToTools } from '@/lib/firebase';
import type { Tool } from '../types';
import ToolsManagement from '../dashboard/ToolsManagement';

export default function AdminToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenToTools((loadedTools) => {
            setTools(loadedTools);
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => {
             if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

    return (
        <div className="space-y-4">
            <ToolsManagement initialTools={tools} isLoading={loading} />
        </div>
    );
}

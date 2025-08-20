
'use client';

import { useEffect, useState } from 'react';
import { getStats, isConfigured, initializeUser } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointerClick, Users } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const FirebaseStats = () => {
  const [stats, setStats] = useState<{ views: number; tool_clicks: number; users: number } | null>(null);

  useEffect(() => {
    if (isConfigured) {
      initializeUser();
      const unsubscribe = getStats((newStats) => {
        setStats(newStats);
      });
      return () => unsubscribe();
    }
  }, []);

  if (!isConfigured) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Firebase is not configured. Live stats are disabled.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 my-8">
      <StatCard
        title="Total Views"
        value={stats?.views}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Tool Clicks"
        value={stats?.tool_clicks}
        icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Users"
        value={stats?.users}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === undefined ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default FirebaseStats;

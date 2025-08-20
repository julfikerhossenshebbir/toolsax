
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format, formatDistanceToNow } from 'date-fns';
import { Trash2 as Trash2Icon } from 'lucide-react';
import type { UserData, Notification, AdSettings } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendNotification, saveAdSettingsAction } from './actions';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ALL_TOOLS } from '@/lib/tools';


// --- Stat Cards ---

interface StatCardProps {
  title: string;
  value: string;
  children: React.ReactNode;
}

export function StatCard({ title, value, children }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{children}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// --- User Table ---

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      return <Badge variant={role === 'admin' ? 'default' : 'secondary'}>{role as string || 'user'}</Badge>;
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Active",
    cell: ({ row }) => {
      const lastLogin = row.getValue("lastLogin");
      if (!lastLogin) return <span className="text-muted-foreground">Never</span>;
      // Check if it's a server timestamp placeholder
      if (typeof lastLogin !== 'string' && typeof lastLogin !== 'number') return <span className="text-muted-foreground">Logging in...</span>;
      try {
        return formatDistanceToNow(new Date(lastLogin as string), { addSuffix: true });
      } catch (e) {
        return <span className="text-muted-foreground">Invalid Date</span>
      }
    },
  },
   {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      if (!createdAt) return <span className="text-muted-foreground">Unknown</span>;
       // Check if it's a server timestamp placeholder
      if (typeof createdAt !== 'string' && typeof createdAt !== 'number') return <span className="text-muted-foreground">Just now</span>;
      try {
        return format(new Date(createdAt as string), 'PPP');
      } catch (e) {
        return <span className="text-muted-foreground">Invalid Date</span>;
      }
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function UsersTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// --- Notification Form ---

export function NotificationForm({ currentNotifications }: { currentNotifications: Notification[] }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setNotifications(currentNotifications);
    }, [currentNotifications]);

    const handleAddNotification = () => {
        setNotifications([...notifications, { icon: 'Bell', message: '' }]);
    };

    const handleRemoveNotification = (index: number) => {
        setNotifications(notifications.filter((_, i) => i !== index));
    };

    const handleNotificationChange = (index: number, field: keyof Notification, value: string) => {
        const newNotifications = [...notifications];
        newNotifications[index][field] = value;
        setNotifications(newNotifications);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Filter out empty messages
        const validNotifications = notifications.filter(n => n.message.trim() !== '' && n.icon.trim() !== '');

        const result = await sendNotification(validNotifications);

        if (result.success) {
            toast({
                title: 'Notifications Updated!',
                description: 'The global notifications have been successfully saved.'
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.error || 'An unknown error occurred.',
            });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Global Notifications</CardTitle>
                <CardDescription>
                  Send site-wide notifications to all users. These appear in the bell icon in the header.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.map((notif, index) => (
                        <div key={index} className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
                            <Input
                                placeholder="Icon name (e.g., Bell)"
                                value={notif.icon}
                                onChange={(e) => handleNotificationChange(index, 'icon', e.target.value)}
                                className="w-full sm:w-1/3"
                            />
                            <Textarea
                                placeholder="Notification message..."
                                value={notif.message}
                                onChange={(e) => handleNotificationChange(index, 'message', e.target.value)}
                                className="h-10 flex-grow"
                            />
                            <Button variant="destructive" size="icon" onClick={() => handleRemoveNotification(index)} className="flex-shrink-0">
                                <Trash2Icon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                     <Button onClick={handleAddNotification} variant="outline">
                        Add Notification
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Notifications
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// --- Ad Settings Form ---
export function AdSettingsForm({ currentAdSettings }: { currentAdSettings: AdSettings }) {
    const [settings, setSettings] = useState<AdSettings>(currentAdSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setSettings(currentAdSettings);
    }, [currentAdSettings]);

    const handleToolToggle = (toolId: string) => {
        const enabledTools = settings.enabledTools || [];
        const newEnabledTools = enabledTools.includes(toolId)
            ? enabledTools.filter(id => id !== toolId)
            : [...enabledTools, toolId];
        setSettings({ ...settings, enabledTools: newEnabledTools });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const result = await saveAdSettingsAction(settings);

        if (result.success) {
            toast({
                title: 'Ad Settings Saved!',
                description: 'Your new ad settings are now live.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: result.error || 'An unknown error occurred.',
            });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Advertisement Settings</CardTitle>
                <CardDescription>
                    Control how and when ads are shown to users. These settings apply on a per-user basis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="ads-enabled"
                        checked={settings.adsEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, adsEnabled: checked })}
                    />
                    <Label htmlFor="ads-enabled" className="text-base font-medium">Enable Ads Globally</Label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="view-limit">Ad View Limit (Per User)</Label>
                        <Input
                            id="view-limit"
                            type="number"
                            value={settings.viewLimit}
                            onChange={(e) => setSettings({ ...settings, viewLimit: parseInt(e.target.value, 10) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground">Number of times a user sees an ad before cooldown.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cooldown-minutes">Cooldown (Minutes)</Label>
                        <Input
                            id="cooldown-minutes"
                            type="number"
                            value={settings.cooldownMinutes}
                            onChange={(e) => setSettings({ ...settings, cooldownMinutes: parseInt(e.target.value, 10) || 0 })}
                        />
                         <p className="text-xs text-muted-foreground">Time until the ad view count resets for a user.</p>
                    </div>
                </div>

                <div>
                    <Label className="text-base font-medium">Enable Ads on Specific Tools</Label>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
                        {ALL_TOOLS.map(tool => (
                            <div key={tool.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`tool-${tool.id}`}
                                    checked={(settings.enabledTools || []).includes(tool.id)}
                                    onCheckedChange={() => handleToolToggle(tool.id)}
                                />
                                <Label htmlFor={`tool-${tool.id}`} className="font-normal">{tool.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save User Ad Settings
                </Button>
            </CardContent>
        </Card>
    )
}

// --- User Overview Chart ---
const userChartData = [
  { name: 'Jan', total: 150 },
  { name: 'Feb', total: 200 },
  { name: 'Mar', total: 180 },
  { name: 'Apr', total: 250 },
  { name: 'May', total: 220 },
  { name: 'Jun', total: 300 },
  { name: 'Jul', total: 280 },
  { name: 'Aug', total: 320 },
  { name: 'Sep', total: 290 },
  { name: 'Oct', total: 350 },
  { name: 'Nov', total: 380 },
  { name: 'Dec', total: 400 },
];

export function UserOverviewChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Growth Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// --- Tool Popularity Chart ---
const toolPopularityData = [
  { name: 'JSON Formatter', clicks: 4000 },
  { name: 'QR Generator', clicks: 3000 },
  { name: 'Case Converter', clicks: 2000 },
  { name: 'Password Gen', clicks: 2780 },
  { name: 'Color Conv', clicks: 1890 },
  { name: 'Lorem Ipsum', clicks: 2390 },
  { name: 'Unit Conv', clicks: 3490 },
];

export function ToolPopularityChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tool Popularity</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={toolPopularityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorClicks)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

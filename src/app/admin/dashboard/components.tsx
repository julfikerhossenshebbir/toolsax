
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
import type { UserData, Notification } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendNotification } from './actions';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getMonthlyUserGrowth, getTopToolsByClicks } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';


// --- Stat Cards ---

interface StatCardProps {
  title: string;
  value: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export function StatCard({ title, value, isLoading, children }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{children}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
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
      let variant: "default" | "secondary" | "outline" | "destructive" = "secondary";
      if (role === 'admin') variant = 'destructive';
      if (role === 'vip') variant = 'default';
      return <Badge variant={variant}>{role as string || 'user'}</Badge>;
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
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                placeholder="Icon name (e.g., Bell)"
                                value={notif.icon}
                                onChange={(e) => handleNotificationChange(index, 'icon', e.target.value)}
                                className="w-1/3"
                            />
                            <Input
                                placeholder="Notification message..."
                                value={notif.message}
                                onChange={(e) => handleNotificationChange(index, 'message', e.target.value)}
                                className="flex-grow"
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

// --- User Overview Chart ---
export function UserOverviewChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMonthlyUserGrowth().then((chartData) => {
            setData(chartData);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Growth Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-[300px]" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Growth Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
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
export function ToolPopularityChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopToolsByClicks().then((chartData) => {
            setData(chartData);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tool Popularity</CardTitle>
                </CardHeader>
                <CardContent>
                     <Skeleton className="w-full h-[300px]" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tool Popularity</CardTitle>
                <CardDescription>Top 7 most clicked tools.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

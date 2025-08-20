'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format, formatDistanceToNow } from 'date-fns';
import { AreaChart, BarChart, Users } from 'lucide-react';
import type { UserData, Notification } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendNotification } from './actions';
import { Loader2 } from 'lucide-react';


// --- Stat Cards ---

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
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
      return formatDistanceToNow(new Date(lastLogin as string), { addSuffix: true });
    },
  },
   {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      if (!createdAt) return <span className="text-muted-foreground">Unknown</span>;
      return format(new Date(createdAt as string), 'PPP');
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
    <div className="rounded-md border">
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
                No results.
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
    const [notifications, setNotifications] = useState<Notification[]>(currentNotifications);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

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

        if (validNotifications.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No valid notifications',
                description: 'Please add at least one notification with a message and icon name.'
            });
            setIsSubmitting(false);
            return;
        }

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
                <CardTitle>Manage Notifications</CardTitle>
                <CardContent className="p-0 pt-4">
                    <div className="space-y-4">
                        {notifications.map((notif, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                                <Input
                                    placeholder="Icon name (e.g., Bell)"
                                    value={notif.icon}
                                    onChange={(e) => handleNotificationChange(index, 'icon', e.target.value)}
                                />
                                <Textarea
                                    placeholder="Notification message..."
                                    value={notif.message}
                                    onChange={(e) => handleNotificationChange(index, 'message', e.target.value)}
                                    className="h-10"
                                />
                                <Button variant="destructive" size="icon" onClick={() => handleRemoveNotification(index)}>
                                    <Users className="h-4 w-4" />
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
            </CardHeader>
        </Card>
    )
}

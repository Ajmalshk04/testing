import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX, Mail, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { cn } from '@/lib/utils';
import type { User } from '@/services/userService';
import { userService } from '@/services/userService';
import type {
  DataTableToolbarConfig,
  DataTableAction,
} from '@/components/data-table/types';

interface RecentUsersTableProps {
  showFullFeatures?: boolean;
}

export function RecentUsersTable({ showFullFeatures = false }: RecentUsersTableProps) {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState({
    current: 1,
    total: 0,
    pages: 0,
    limit: showFullFeatures ? 20 : 5,
  });

  // Load users data
  const loadUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers({}, pagination.current, pagination.limit);
      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.limit]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle quick actions
  const handleQuickAction = async (action: string, user: User) => {
    try {
      switch (action) {
        case 'view':
          toast.info(`Viewing user: ${user.name}`);
          break;
        case 'edit':
          toast.info(`Editing user: ${user.name}`);
          break;
        case 'toggle-status':
          await userService.bulkUpdateUsers([user._id], { isActive: !user.isActive });
          toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
          loadUsers();
          break;
        case 'delete':
          if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            await userService.bulkDeleteUsers([user._id]);
            toast.success('User deleted successfully');
            loadUsers();
          }
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  // Define columns
  const columns: ColumnDef<User>[] = [
    ...(showFullFeatures ? [{
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }] : []),
    {
      accessorKey: 'name',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }: any) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3 py-1">
            <Avatar className="h-9 w-9 ring-2 ring-primary/10 shadow-sm">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground truncate">{user.name}</div>
              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }: any) => {
        const role = row.getValue('role') as string;
        return (
          <Badge 
            variant={role === 'admin' ? 'default' : 'secondary'}
            className={cn(
              "font-medium",
              role === 'admin' && "bg-blue-500 text-white dark:bg-blue-600"
            )}
          >
            {role.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }: any) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge 
            variant={isActive ? 'default' : 'destructive'}
            className={cn(
              "font-medium flex items-center gap-1",
              isActive && "bg-green-500 text-white dark:bg-green-600"
            )}
          >
            {isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    ...(showFullFeatures ? [{
      accessorKey: 'isEmailVerified',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Email Status" />
      ),
      cell: ({ row }: any) => {
        const isVerified = row.getValue('isEmailVerified') as boolean;
        return (
          <Badge 
            variant={isVerified ? 'default' : 'secondary'}
            className={cn(
              "font-medium flex items-center gap-1",
              isVerified && "bg-emerald-500 text-white dark:bg-emerald-600"
            )}
          >
            <Mail className="h-3 w-3" />
            {isVerified ? 'Verified' : 'Pending'}
          </Badge>
        );
      },
    }] : []),
    {
      accessorKey: 'createdAt',
      header: ({ column }: any) => (
        <DataTableColumnHeader column={column} title="Joined" />
      ),
      cell: ({ row }: any) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{date.toLocaleDateString()}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted transition-colors">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleQuickAction('view', user)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAction('edit', user)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleQuickAction('toggle-status', user)} className="cursor-pointer">
                {user.isActive ? (
                  <UserX className="mr-2 h-4 w-4" />
                ) : (
                  <UserCheck className="mr-2 h-4 w-4" />
                )}
                {user.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleQuickAction('delete', user)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Define toolbar configuration
  const toolbarConfig: DataTableToolbarConfig<User> = {
    searchColumn: 'name',
    searchPlaceholder: 'Search users...',
    ...(showFullFeatures && {
      facetedFilters: [
        {
          column: 'role',
          title: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ],
        },
        {
          column: 'isActive',
          title: 'Status',
          options: [
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ],
        },
        {
          column: 'isEmailVerified',
          title: 'Email',
          options: [
            { label: 'Verified', value: 'true' },
            { label: 'Pending', value: 'false' },
          ],
        },
      ],
      dateFilters: [
        {
          column: 'createdAt',
          title: 'Join Date',
          placeholder: 'Select date range...',
        },
      ],
    }),
  };

  return (
    <div className="space-y-6">
      <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          toolbarConfig={showFullFeatures ? toolbarConfig : undefined}
          enableRowSelection={showFullFeatures}
          enableMultiSelect={showFullFeatures}
          enableSorting={true}
          enableFiltering={showFullFeatures}
          enablePagination={showFullFeatures}
          pageSize={pagination.limit}
          pageSizeOptions={showFullFeatures ? [10, 20, 50] : undefined}
        />
      </div>

      {!showFullFeatures && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-border/40 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-muted-foreground font-medium">
              Preview showing {users.length} recent users
            </p>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
            <Users className="mr-2 h-4 w-4" />
            View Full User Management →
          </Button>
        </div>
      )}
    </div>
  );
}
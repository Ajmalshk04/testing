"use client"

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2, Edit, UserCheck, UserX, Download, Shield, Mail } from 'lucide-react';
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
import { User, userService, UserFilters } from '@/services/userService';
import {
  DataTableToolbarConfig,
  DataTableAction,
} from '@/components/data-table/types';

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState({
    current: 1,
    total: 0,
    pages: 0,
    limit: 10,
  });
  const [filters, setFilters] = React.useState<UserFilters>({});

  // Load users data
  const loadUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(filters, pagination.current, pagination.limit);
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
  }, [filters, pagination.current, pagination.limit]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle bulk actions
  const handleBulkActivate = async (selectedRows: User[]) => {
    try {
      const userIds = selectedRows.map(user => user._id);
      await userService.bulkUpdateUsers(userIds, { isActive: true });
      toast.success(`Activated ${userIds.length} users`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to activate users');
    }
  };

  const handleBulkDeactivate = async (selectedRows: User[]) => {
    try {
      const userIds = selectedRows.map(user => user._id);
      await userService.bulkUpdateUsers(userIds, { isActive: false });
      toast.success(`Deactivated ${userIds.length} users`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to deactivate users');
    }
  };

  const handleBulkDelete = async (selectedRows: User[]) => {
    if (!confirm('Are you sure you want to delete the selected users?')) return;
    
    try {
      const userIds = selectedRows.map(user => user._id);
      await userService.bulkDeleteUsers(userIds);
      toast.success(`Deleted ${userIds.length} users`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete users');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await userService.exportUsers(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported successfully');
    } catch (error) {
      toast.error('Failed to export users');
    }
  };

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
            <Shield className="mr-1 h-3 w-3" />
            {role.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? <UserCheck className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isEmailVerified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const isVerified = row.getValue('isEmailVerified') as boolean;
        return (
          <Badge variant={isVerified ? 'default' : 'secondary'}>
            <Mail className="mr-1 h-3 w-3" />
            {isVerified ? 'Verified' : 'Pending'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        return new Date(row.getValue('createdAt')).toLocaleDateString();
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
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
    facetedFilters: [
      {
        column: 'role',
        title: 'Role',
        options: userService.getRoleOptions(),
      },
      {
        column: 'isActive',
        title: 'Status',
        options: userService.getStatusOptions(),
      },
    ],
    dateFilters: [
      {
        column: 'createdAt',
        title: 'Created Date',
        placeholder: 'Select date range...',
      },
    ],
    actions: [
      {
        label: 'Export',
        icon: Download,
        onClick: handleExport,
        variant: 'outline',
      },
    ] as DataTableAction<User>[],
  };

  // Define bulk actions
  const bulkActions: DataTableAction<User>[] = [
    {
      label: 'Activate',
      icon: UserCheck,
      onClick: handleBulkActivate,
      variant: 'default',
    },
    {
      label: 'Deactivate',
      icon: UserX,
      onClick: handleBulkDeactivate,
      variant: 'secondary',
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleBulkDelete,
      variant: 'destructive',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users with advanced filtering and bulk operations
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        toolbarConfig={{ ...toolbarConfig, actions: [...(toolbarConfig.actions || []), ...bulkActions] }}
        enableRowSelection={true}
        enableMultiSelect={true}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={pagination.limit}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
}
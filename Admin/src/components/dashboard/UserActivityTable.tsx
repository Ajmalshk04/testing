import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Activity, LogIn, LogOut, Edit, Trash2, Eye, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type {
  DataTableToolbarConfig,
} from '@/components/data-table/types';

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'login' | 'logout' | 'update_profile' | 'change_password' | 'delete_account' | 'view_page';
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  duration?: number; // in minutes
  success: boolean;
}

// Mock data generator
const generateMockActivities = (): UserActivity[] => {
  const users = [
    { id: '1', name: 'John Doe', avatar: '' },
    { id: '2', name: 'Sarah Smith', avatar: '' },
    { id: '3', name: 'Mike Johnson', avatar: '' },
    { id: '4', name: 'Emma Wilson', avatar: '' },
    { id: '5', name: 'David Brown', avatar: '' },
  ];

  const actions: UserActivity['action'][] = [
    'login', 'logout', 'update_profile', 'change_password', 'view_page'
  ];

  const descriptions = {
    login: 'User logged into the system',
    logout: 'User logged out of the system',
    update_profile: 'User updated their profile information',
    change_password: 'User changed their password',
    delete_account: 'User deleted their account',
    view_page: 'User viewed a page',
  };

  const activities: UserActivity[] = [];
  
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const success = Math.random() > 0.1; // 90% success rate
    
    activities.push({
      id: `activity-${i + 1}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      action,
      description: descriptions[action],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      duration: action === 'login' ? Math.floor(Math.random() * 240) + 5 : undefined,
      success,
    });
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function UserActivityTable() {
  const [activities] = React.useState<UserActivity[]>(generateMockActivities());
  const [loading] = React.useState(false);

  const getActionIcon = (action: UserActivity['action']) => {
    switch (action) {
      case 'login':
        return LogIn;
      case 'logout':
        return LogOut;
      case 'update_profile':
        return Edit;
      case 'change_password':
        return Edit;
      case 'delete_account':
        return Trash2;
      case 'view_page':
        return Eye;
      default:
        return Activity;
    }
  };

  const getActionColor = (action: UserActivity['action']) => {
    switch (action) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-blue-100 text-blue-800';
      case 'update_profile':
        return 'bg-yellow-100 text-yellow-800';
      case 'change_password':
        return 'bg-purple-100 text-purple-800';
      case 'delete_account':
        return 'bg-red-100 text-red-800';
      case 'view_page':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Define columns
  const columns: ColumnDef<UserActivity>[] = [
    {
      accessorKey: 'userName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const activity = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.userAvatar} />
              <AvatarFallback>
                {activity.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{activity.userName}</div>
              <div className="text-sm text-muted-foreground">ID: {activity.userId}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => {
        const action = row.getValue('action') as UserActivity['action'];
        const Icon = getActionIcon(action);
        return (
          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getActionColor(action)}`}>
            <Icon className="mr-1 h-3 w-3" />
            {action.replace('_', ' ').toUpperCase()}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'success',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const success = row.getValue('success') as boolean;
        return (
          <Badge variant={success ? 'default' : 'destructive'}>
            {success ? 'Success' : 'Failed'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'duration',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Duration" />
      ),
      cell: ({ row }) => {
        const duration = row.getValue('duration') as number | undefined;
        if (!duration) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{duration}m</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time" />
      ),
      cell: ({ row }) => {
        const timestamp = new Date(row.getValue('timestamp'));
        return (
          <div className="text-sm">
            <div>{timestamp.toLocaleDateString()}</div>
            <div className="text-muted-foreground">{timestamp.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'ipAddress',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IP Address" />
      ),
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {row.getValue('ipAddress')}
        </code>
      ),
    },
  ];

  // Define toolbar configuration with advanced filters
  const toolbarConfig: DataTableToolbarConfig<UserActivity> = {
    searchColumn: 'userName',
    searchPlaceholder: 'Search by user name...',
    facetedFilters: [
      {
        column: 'action',
        title: 'Action Type',
        options: [
          { label: 'Login', value: 'login' },
          { label: 'Logout', value: 'logout' },
          { label: 'Update Profile', value: 'update_profile' },
          { label: 'Change Password', value: 'change_password' },
          { label: 'View Page', value: 'view_page' },
        ],
      },
      {
        column: 'success',
        title: 'Status',
        options: [
          { label: 'Success', value: 'true' },
          { label: 'Failed', value: 'false' },
        ],
      },
    ],
    dateFilters: [
      {
        column: 'timestamp',
        title: 'Activity Date',
        placeholder: 'Select date range...',
      },
    ],
    rangeFilters: [
      {
        column: 'duration',
        title: 'Session Duration',
        min: 0,
        max: 300,
        unit: 'minutes',
      },
    ],
  };

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={activities}
        loading={loading}
        toolbarConfig={toolbarConfig}
        enableRowSelection={false}
        enableMultiSelect={false}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
      />
    </div>
  );
}
import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Info, XCircle, CheckCircle, Server, Database, Shield, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type {
  DataTableToolbarConfig,
} from '@/components/data-table/types';

interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'database' | 'auth' | 'api' | 'security';
  message: string;
  details?: string;
  timestamp: string;
  source: string;
  userId?: string;
  responseTime?: number; // in milliseconds
  memoryUsage?: number; // in MB
  cpuUsage?: number; // in percentage
}

// Mock data generator
const generateMockLogs = (): SystemLog[] => {
  const levels: SystemLog['level'][] = ['info', 'warning', 'error', 'success'];
  const categories: SystemLog['category'][] = ['system', 'database', 'auth', 'api', 'security'];
  
  const messages = {
    info: [
      'Server startup completed successfully',
      'User session created',
      'Database connection established',
      'Cache refreshed',
      'Scheduled task completed',
    ],
    warning: [
      'High memory usage detected',
      'Slow database query detected',
      'Rate limit threshold approaching',
      'Disk space running low',
      'Connection pool nearly exhausted',
    ],
    error: [
      'Failed to connect to database',
      'Authentication failed for user',
      'API request timeout',
      'File system error',
      'Service unavailable',
    ],
    success: [
      'Backup completed successfully',
      'Database migration completed',
      'Security scan passed',
      'Performance optimization applied',
      'System health check passed',
    ],
  };

  const sources = [
    'web-server-01',
    'auth-service',
    'database-primary',
    'api-gateway',
    'security-scanner',
    'backup-service',
  ];

  const logs: SystemLog[] = [];
  
  for (let i = 0; i < 100; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const messageList = messages[level];
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    
    logs.push({
      id: `log-${i + 1}`,
      level,
      category,
      message,
      details: Math.random() > 0.7 ? `Additional context: ${message.toLowerCase()}` : undefined,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      userId: Math.random() > 0.6 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
      responseTime: Math.floor(Math.random() * 5000) + 10, // 10-5000ms
      memoryUsage: Math.floor(Math.random() * 1000) + 100, // 100-1100MB
      cpuUsage: Math.floor(Math.random() * 100), // 0-100%
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function SystemLogsTable() {
  const [logs] = React.useState<SystemLog[]>(generateMockLogs());
  const [loading] = React.useState(false);

  const getLevelIcon = (level: SystemLog['level']) => {
    switch (level) {
      case 'info':
        return Info;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return XCircle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getLevelColor = (level: SystemLog['level']) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: SystemLog['category']) => {
    switch (category) {
      case 'system':
        return Server;
      case 'database':
        return Database;
      case 'auth':
        return Shield;
      case 'api':
        return Zap;
      case 'security':
        return Shield;
      default:
        return Server;
    }
  };

  // Define columns
  const columns: ColumnDef<SystemLog>[] = [
    {
      accessorKey: 'level',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Level" />
      ),
      cell: ({ row }) => {
        const level = row.getValue('level') as SystemLog['level'];
        const Icon = getLevelIcon(level);
        return (
          <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getLevelColor(level)}`}>
            <Icon className="mr-1 h-3 w-3" />
            {level.toUpperCase()}
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category = row.getValue('category') as SystemLog['category'];
        const Icon = getCategoryIcon(category);
        return (
          <Badge variant="outline" className="font-normal">
            <Icon className="mr-1 h-3 w-3" />
            {category.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'message',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => {
        const log = row.original;
        return (
          <div>
            <div className="font-medium max-w-[400px] truncate">
              {log.message}
            </div>
            {log.details && (
              <div className="text-sm text-muted-foreground max-w-[400px] truncate">
                {log.details}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'source',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Source" />
      ),
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
          {row.getValue('source')}
        </code>
      ),
    },
    {
      accessorKey: 'responseTime',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Response Time" />
      ),
      cell: ({ row }) => {
        const responseTime = row.getValue('responseTime') as number;
        const isSlowPeaks = responseTime > 1000;
        return (
          <span className={`text-sm ${isSlowPeaks ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
            {responseTime}ms
          </span>
        );
      },
    },
    {
      accessorKey: 'memoryUsage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Memory" />
      ),
      cell: ({ row }) => {
        const memory = row.getValue('memoryUsage') as number;
        const isHigh = memory > 800;
        return (
          <span className={`text-sm ${isHigh ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
            {memory}MB
          </span>
        );
      },
    },
    {
      accessorKey: 'cpuUsage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CPU" />
      ),
      cell: ({ row }) => {
        const cpu = row.getValue('cpuUsage') as number;
        const isHigh = cpu > 80;
        return (
          <span className={`text-sm ${isHigh ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
            {cpu}%
          </span>
        );
      },
    },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Timestamp" />
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
  ];

  // Define toolbar configuration with slider filters
  const toolbarConfig: DataTableToolbarConfig<SystemLog> = {
    searchColumn: 'message',
    searchPlaceholder: 'Search log messages...',
    facetedFilters: [
      {
        column: 'level',
        title: 'Log Level',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
          { label: 'Success', value: 'success' },
        ],
      },
      {
        column: 'category',
        title: 'Category',
        options: [
          { label: 'System', value: 'system' },
          { label: 'Database', value: 'database' },
          { label: 'Authentication', value: 'auth' },
          { label: 'API', value: 'api' },
          { label: 'Security', value: 'security' },
        ],
      },
      {
        column: 'source',
        title: 'Source',
        options: [
          { label: 'Web Server', value: 'web-server-01' },
          { label: 'Auth Service', value: 'auth-service' },
          { label: 'Database', value: 'database-primary' },
          { label: 'API Gateway', value: 'api-gateway' },
          { label: 'Security Scanner', value: 'security-scanner' },
          { label: 'Backup Service', value: 'backup-service' },
        ],
      },
    ],
    dateFilters: [
      {
        column: 'timestamp',
        title: 'Log Date',
        placeholder: 'Select date range...',
      },
    ],
    sliderFilters: [
      {
        column: 'responseTime',
        title: 'Response Time (ms)',
        min: 0,
        max: 5000,
        step: 50,
        unit: 'ms',
        formatValue: (value) => `${value}ms`,
      },
      {
        column: 'memoryUsage',
        title: 'Memory Usage (MB)',
        min: 0,
        max: 1200,
        step: 10,
        unit: 'MB',
        formatValue: (value) => `${value}MB`,
      },
      {
        column: 'cpuUsage',
        title: 'CPU Usage (%)',
        min: 0,
        max: 100,
        step: 5,
        unit: '%',
        formatValue: (value) => `${value}%`,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="ml-2 text-sm font-medium text-blue-900">Info Logs</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {logs.filter(log => log.level === 'info').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="ml-2 text-sm font-medium text-yellow-900">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {logs.filter(log => log.level === 'warning').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="ml-2 text-sm font-medium text-red-900">Errors</span>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {logs.filter(log => log.level === 'error').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="ml-2 text-sm font-medium text-green-900">Success</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {logs.filter(log => log.level === 'success').length}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        toolbarConfig={toolbarConfig}
        enableRowSelection={false}
        enableMultiSelect={false}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={20}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </div>
  );
}
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BarChart3,
  Users,
  Settings,
  Database,
  Activity,
  FileText,
  Shield,
  Bell,
  HelpCircle,
  Zap,
  Globe,
  Calendar,
  PieChart,
  TrendingUp,
  UserCheck,
  Lock,
  Monitor,
  Server,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
  isActive?: boolean;
}

const navigationItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: BarChart3,
    badge: 'Live'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUp,
    children: [
      { id: 'analytics-overview', label: 'Overview', icon: PieChart },
      { id: 'analytics-reports', label: 'Reports', icon: FileText },
      { id: 'analytics-trends', label: 'Trends', icon: TrendingUp }
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    badge: 128,
    children: [
      { id: 'users-all', label: 'All Users', icon: Users },
      { id: 'users-active', label: 'Active Users', icon: UserCheck },
      { id: 'users-roles', label: 'Roles & Permissions', icon: Shield }
    ]
  },
  {
    id: 'activity',
    label: 'Activity Monitor',
    icon: Activity,
    badge: 'New'
  },
  {
    id: 'system',
    label: 'System',
    icon: Database,
    children: [
      { id: 'system-logs', label: 'System Logs', icon: FileText },
      { id: 'system-performance', label: 'Performance', icon: Monitor },
      { id: 'system-security', label: 'Security', icon: Lock },
      { id: 'system-servers', label: 'Servers', icon: Server }
    ]
  }
];

const quickActions: NavItem[] = [
  { id: 'search', label: 'Global Search', icon: Search },
  { id: 'add-user', label: 'Add User', icon: Plus },
  { id: 'filter', label: 'Advanced Filter', icon: Filter },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 }
];

export function Sidebar({ isCollapsed, onToggle, activeSection = 'overview', onSectionChange }: SidebarProps) {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['users', 'system']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-1">
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "w-full justify-start h-10 px-3 transition-all duration-200",
            level > 0 && "ml-4 w-[calc(100%-1rem)]",
            isActive && "bg-primary/10 text-primary border border-primary/20 shadow-sm dark:bg-primary/20 dark:text-primary-foreground",
            !isCollapsed && "text-left",
            isCollapsed && "justify-center px-2"
          )}
          onClick={() => {
            if (hasChildren && !isCollapsed) {
              toggleExpanded(item.id);
            } else {
              handleSectionClick(item.id);
            }
          }}
        >
          <item.icon className={cn(
            "h-4 w-4 flex-shrink-0",
            isActive ? "text-primary" : "text-muted-foreground"
          )} />
          
          {!isCollapsed && (
            <>
              <span className="flex-1 ml-3 text-sm font-medium truncate">
                {item.label}
              </span>
              
              {item.badge && (
                <Badge 
                  variant={typeof item.badge === 'string' && item.badge === 'Live' ? "default" : "secondary"}
                  className={cn(
                    "ml-2 text-xs h-5 px-2",
                    typeof item.badge === 'string' && item.badge === 'Live' && "bg-green-500 text-white animate-pulse dark:bg-green-600",
                    typeof item.badge === 'string' && item.badge === 'New' && "bg-orange-500 text-white dark:bg-orange-600"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              
              {hasChildren && (
                <ChevronRight className={cn(
                  "h-4 w-4 ml-2 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} />
              )}
            </>
          )}
        </Button>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="space-y-1 ml-2">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "relative flex flex-col bg-card/95 backdrop-blur border-r border-border/50 shadow-lg transition-all duration-300 ease-in-out",
      "dark:bg-card/90 dark:border-border/30",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-lg shadow-md">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-foreground to-blue-600 dark:to-blue-400 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-muted-foreground">Enterprise Dashboard</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user?.email || 'admin@company.com'}
              </div>
              <Badge variant="outline" className="mt-1 text-xs">
                {user?.role?.toUpperCase() || 'ADMIN'}
              </Badge>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <HelpCircle className="h-3 w-3 mr-1" />
              Help
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-2 animate-fade-in">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Navigation
            </h3>
          )}
          {navigationItems.map(item => renderNavItem(item))}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
          )}
          {quickActions.map(item => renderNavItem(item))}
        </div>

        {!isCollapsed && (
          <>
            <Separator />
            
            {/* System Status */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System Status
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-800 dark:text-green-200">Server Online</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-300">99.9%</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-200">API Status</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-300">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                    <span className="text-xs font-medium text-orange-800 dark:text-orange-200">Alerts</span>
                  </div>
                  <Badge variant="secondary" className="text-xs h-4 px-1">3</Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        {!isCollapsed && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">
              © 2024 Enterprise Dashboard
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground font-medium">Powered by React</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
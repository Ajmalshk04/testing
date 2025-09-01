import React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function DashboardLayout({ 
  children, 
  activeSection = 'overview', 
  onSectionChange 
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-all duration-500">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      
      <div className="flex flex-col flex-1">
        {/* Header Bar */}
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">
                  {activeSection === 'overview' && 'Dashboard Overview'}
                  {activeSection === 'users' && 'User Management'}
                  {activeSection === 'analytics' && 'Analytics'}
                  {activeSection === 'activity' && 'Activity Monitor'}
                  {activeSection === 'system' && 'System Management'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <ThemeToggle variant="compact" showLabel={false} />
              
              <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-border/40">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-muted-foreground">{user?.role?.toUpperCase() || 'ADMIN'}</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
          "bg-background/50 backdrop-blur-sm custom-scrollbar"
        )}>
          <div className="container mx-auto p-6 space-y-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
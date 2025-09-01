import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, 
  Settings, 
  Shield, 
  Users, 
  Activity, 
  Database, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Monitor,
  AlertTriangle,
  Globe,
  Server,
  DollarSign,
  Clock,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable';
import { UserActivityTable } from '@/components/dashboard/UserActivityTable';
import { SystemLogsTable } from '@/components/dashboard/SystemLogsTable';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [activeSection, setActiveSection] = React.useState('overview');

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data for enterprise metrics
  const enterpriseMetrics = {
    totalRevenue: 2847956,
    activeProjects: 47,
    teamMembers: 128,
    serverUptime: 99.97,
    apiCalls: 1247563,
    errorRate: 0.02,
    avgResponseTime: 143,
    pendingTasks: 23
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
      case 'users-all':
        return (
          <div className="space-y-6">
            <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="px-6 py-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage all users, roles, and permissions
                </p>
              </div>
            </div>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    All Users
                  </CardTitle>
                  <CardDescription>
                    Complete user management with advanced filtering and bulk operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentUsersTable showFullFeatures />
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'activity':
        return (
          <div className="space-y-6">
            <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="px-6 py-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Activity Monitor
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track user activities and system events in real-time
                </p>
              </div>
            </div>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    User Activity Dashboard
                  </CardTitle>
                  <CardDescription>
                    Comprehensive activity monitoring with advanced analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserActivityTable />
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'system':
      case 'system-logs':
        return (
          <div className="space-y-6">
            <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="px-6 py-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  System Logs
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor system events, errors, and operational data
                </p>
              </div>
            </div>
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Events & Logs
                  </CardTitle>
                  <CardDescription>
                    Real-time system monitoring and event tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemLogsTable />
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default: // overview
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                        <Monitor className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                          Enterprise Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-slate-100 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                          {user?.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-muted-foreground">{user?.role?.toUpperCase()}</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                    <p className="text-blue-100 mb-4">
                      Here's what's happening with your business today.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>All systems operational</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Global access enabled</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-100">System Status</div>
                    <div className="text-2xl font-bold">{enterpriseMetrics.serverUptime}%</div>
                    <div className="text-sm text-blue-100">Uptime</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-900">
                      ${(enterpriseMetrics.totalRevenue / 1000000).toFixed(2)}M
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700">Active Projects</CardTitle>
                    <FileText className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">{enterpriseMetrics.activeProjects}</div>
                    <p className="text-xs text-blue-600 mt-1">
                      +3 new this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900">{enterpriseMetrics.teamMembers}</div>
                    <p className="text-xs text-purple-600 mt-1">
                      +8 this quarter
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700">Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-900">{enterpriseMetrics.avgResponseTime}ms</div>
                    <p className="text-xs text-orange-600 mt-1">
                      -8.7% improvement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analytics
                  </CardTitle>
                  <CardDescription>
                    Real-time system metrics and business insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsOverview />
                </CardContent>
              </Card>

              {/* Data Management Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Latest user registrations and account status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentUsersTable />
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveSection('users')}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        View All Users
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Activity
                    </CardTitle>
                    <CardDescription>
                      Recent system events and user activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">System backup completed</div>
                          <div className="text-xs text-muted-foreground">2 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">5 new user registrations</div>
                          <div className="text-xs text-muted-foreground">15 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">High API usage detected</div>
                          <div className="text-xs text-muted-foreground">1 hour ago</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveSection('activity')}
                      >
                        <Activity className="mr-2 h-4 w-4" />
                        View Activity Monitor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={handleSectionChange}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
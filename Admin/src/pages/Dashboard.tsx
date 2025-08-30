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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Settings, Shield, Users, Activity, Database, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable';
import { UserActivityTable } from '@/components/dashboard/UserActivityTable';
import { SystemLogsTable } from '@/components/dashboard/SystemLogsTable';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState('overview');

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Explore advanced data tables and analytics.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Data
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* User Profile Card */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user?.name}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Role:</span>
                  </div>
                  <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                    {user?.role?.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm">Account Status:</span>
                  <Badge variant={user?.isActive ? 'default' : 'destructive'}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm">Email Verified:</span>
                  <Badge variant={user?.isEmailVerified ? 'default' : 'secondary'}>
                    {user?.isEmailVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
                <CardDescription>
                  Real-time system metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsOverview />
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Data Table Features</CardTitle>
                <CardDescription>
                  Explore advanced data table capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View User Data Tables
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('activity')}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Monitor User Activity
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('system')}
                >
                  <Database className="mr-2 h-4 w-4" />
                  System Logs & Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Featured Data Table Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Users - Data Table Preview
              </CardTitle>
              <CardDescription>
                Preview of advanced data table features with real user data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentUsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management Data Table</CardTitle>
              <CardDescription>
                Advanced filtering, sorting, and bulk operations for user data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentUsersTable showFullFeatures />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Monitoring</CardTitle>
              <CardDescription>
                Track user actions, login patterns, and system interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivityTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs & Events</CardTitle>
              <CardDescription>
                Monitor system events, errors, and operational data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemLogsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
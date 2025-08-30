import React from 'react';
import { TrendingUp, TrendingDown, Users, Activity, Server, AlertCircle, Zap, Globe, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  suffix?: string;
  gradient: string;
  index: number;
}

function MetricCard({ title, value, change, icon: Icon, suffix, gradient, index }: MetricCardProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-emerald-600' : 'text-red-600';
  const changeBg = isPositive ? 'bg-emerald-100' : 'bg-red-100';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div 
      className={cn(
        "relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500 hover:scale-105",
        "animate-in slide-in-from-bottom-4 duration-700"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient hover effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{title}</h3>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all duration-300",
            changeBg, changeColor
          )}>
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix && <span className="text-lg text-gray-600">{suffix}</span>}
          </span>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-[shimmer_1.5s_ease-out] opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
}

export function AnalyticsOverview() {
  const [metrics] = React.useState({
    totalUsers: 2847,
    activeUsers: 1249,
    systemUptime: 99.9,
    apiRequests: 45672,
    errorRate: 0.02,
    avgResponseTime: 143,
  });

  const [changes] = React.useState({
    totalUsers: 12.5,
    activeUsers: 8.3,
    systemUptime: -0.1,
    apiRequests: 23.1,
    errorRate: -45.2,
    avgResponseTime: -8.7,
  });

  const metricsData = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      change: changes.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers,
      change: changes.activeUsers,
      icon: Activity,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'System Uptime',
      value: metrics.systemUptime,
      change: changes.systemUptime,
      icon: Server,
      suffix: '%',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'API Requests',
      value: `${(metrics.apiRequests / 1000).toFixed(1)}K`,
      change: changes.apiRequests,
      icon: Globe,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            index={index}
          />
        ))}
      </div>

      {/* Enhanced Performance Indicators */}
      <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-slate-600 to-blue-600 rounded-xl shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-blue-800 bg-clip-text text-transparent">
              Performance Indicators
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Error Rate</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-900">{metrics.errorRate}%</span>
                <div className="w-24 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(10, 100 - metrics.errorRate * 50)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Avg Response Time</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-900">{metrics.avgResponseTime}ms</span>
                <div className="w-24 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (metrics.avgResponseTime / 500) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Data Table Features Showcase */}
      <div className="relative bg-gradient-to-br from-blue-50/70 to-indigo-50/70 backdrop-blur-sm rounded-2xl border border-blue-200/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Advanced Data Table Features
              </h3>
              <p className="text-sm text-blue-700/80 leading-relaxed mb-4">
                Experience comprehensive data management with sophisticated filtering, sorting, 
                bulk operations, real-time updates, and intelligent analytics across all dashboard tables.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Advanced Filtering',
                  'Bulk Operations',
                  'Real-time Updates',
                  'Export Options',
                  'Column Management',
                  'Responsive Design',
                  'Smart Analytics',
                  'Custom Views'
                ].map((feature, index) => (
                  <span
                    key={feature}
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105",
                      "bg-white/60 backdrop-blur-sm text-blue-800 border border-blue-200/40 shadow-sm hover:shadow-md",
                      "animate-in fade-in-50 duration-500"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * Dashboard Page
 *
 * Main dashboard with:
 * - Key metrics cards (sites, clients, revenue)
 * - Occupancy rate visualization
 * - Recent activities list
 * - Quick action buttons
 *
 * Uses React Query for data fetching with auto-refresh
 */

import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, MapPin, Users, Activity as ActivityIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { ActionTypeBadge } from '@/components/StatusBadge';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { ROUTES } from '@/config/constants';
import { cn } from '@/lib/utils';

/**
 * Metric card component
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn('rounded-lg p-2', colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp
              className={cn(
                'mr-1 h-3 w-3',
                trend.isPositive ? 'text-green-600' : 'text-red-600',
                !trend.isPositive && 'rotate-180'
              )}
            />
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-gray-500">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Dashboard Page Component
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { metrics, recentActivities, isLoading, isError, refetchAll } = useDashboard(10);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Error state
  if (isError || !metrics) {
    return <ErrorState onRetry={refetchAll} />;
  }

  // Calculate occupancy percentage
  const occupancyPercent = metrics.occupancyRate.toFixed(1);
  const isHighOccupancy = metrics.occupancyRate >= 80;
  const isMediumOccupancy = metrics.occupancyRate >= 50 && metrics.occupancyRate < 80;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your advertising sites and activities"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.SITES)}>
              <MapPin className="mr-2 h-4 w-4" />
              View Sites
            </Button>
            <Button onClick={() => navigate(ROUTES.ACTIVITIES_NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              New Activity
            </Button>
          </div>
        }
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sites"
          value={metrics.totalSites}
          description={`${metrics.activeSites} active, ${metrics.availableSites} available`}
          icon={MapPin}
          color="blue"
        />
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients}
          description="Active clients"
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          description="All time revenue"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${occupancyPercent}%`}
          description={`${metrics.activeSites} of ${metrics.totalSites} sites occupied`}
          icon={ActivityIcon}
          color={isHighOccupancy ? 'green' : isMediumOccupancy ? 'orange' : 'blue'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Occupancy Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>Site availability and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Occupancy Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Site Occupancy</span>
                <span className="text-gray-500">{occupancyPercent}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isHighOccupancy
                      ? 'bg-green-500'
                      : isMediumOccupancy
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                  )}
                  style={{ width: `${metrics.occupancyRate}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="rounded-lg border bg-green-50 p-3">
                <div className="text-2xl font-bold text-green-700">{metrics.activeSites}</div>
                <div className="text-xs text-green-600">Active Sites</div>
              </div>
              <div className="rounded-lg border bg-orange-50 p-3">
                <div className="text-2xl font-bold text-orange-700">{metrics.availableSites}</div>
                <div className="text-xs text-orange-600">Available Sites</div>
              </div>
              <div className="rounded-lg border bg-blue-50 p-3">
                <div className="text-2xl font-bold text-blue-700">{metrics.totalActivities}</div>
                <div className="text-xs text-blue-600">Total Activities</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <div className="text-sm text-gray-500">New Bookings</div>
                <div className="text-xl font-semibold">{metrics.newBookings}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Client Shifts</div>
                <div className="text-xl font-semibold">{metrics.clientShifts}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest site activities and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {!recentActivities || recentActivities.length === 0 ? (
              <EmptyState
                variant="no-data"
                title="No recent activities"
                description="Recent activities will appear here"
                className="min-h-[200px]"
              />
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.siteNo}</span>
                        <ActionTypeBadge action={activity.action} />
                      </div>
                      <div className="text-sm text-gray-600">{activity.clientName}</div>
                      <div className="text-xs text-gray-500">{formatDate(activity.date)}</div>
                    </div>
                    {activity.ratePerMonth && (
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(activity.ratePerMonth)}</div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    )}
                  </div>
                ))}

                {/* View All Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(ROUTES.ACTIVITIES)}
                >
                  View All Activities
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.SITES_NEW)}
              className="justify-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Site
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.CLIENTS_NEW)}
              className="justify-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.ACTIVITIES_NEW)}
              className="justify-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Activity
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.REPORTS)}
              className="justify-start"
            >
              <ActivityIcon className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

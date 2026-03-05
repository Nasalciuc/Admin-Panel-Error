import { KpiTiles } from '../components/d1/kpi-tiles'
import { NetworkActivities } from '../components/d1/network-activities'
import { AppVersions } from '../components/d1/app-versions'
import { DeviceUsage } from '../components/d1/device-usage'
import { QuickSettings } from '../components/d1/quick-settings'
import { RecentActivities } from '../components/d1/recent-activities'
import { SalesStatistics } from '../components/d1/sales-statistics'
import { RecentOrders } from '../components/d1/recent-orders'
import { VisitorsMap } from '../components/d1/visitors-map'
import { TodoList } from '../components/d1/todo-list'
import { DailyActiveUsers } from '../components/d1/daily-active-users'
import { WeatherWidget } from '../components/d1/weather-widget'

export function Dashboard1() {
  return (
    <div className='space-y-6'>
      {/* KPI tiles — full width */}
      <KpiTiles />

      {/* Network Activities (col-md-8) + Campaign Progress + App Versions + Device Usage (col-md-4) */}
      <div className='grid gap-4 lg:grid-cols-12'>
        <div className='space-y-4 lg:col-span-8'>
          <NetworkActivities />
        </div>
        <div className='space-y-4 lg:col-span-4'>
          <AppVersions />
          <DeviceUsage />
          <QuickSettings />
        </div>
      </div>

      {/* Recent Activities (col-md-6) + Sales Statistics (col-md-6) */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <RecentActivities />
        <SalesStatistics />
      </div>

      {/* Recent Orders (col-md-8) + Visitors Map (col-md-4) */}
      <div className='grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <RecentOrders />
        </div>
        <div className='lg:col-span-4'>
          <VisitorsMap />
        </div>
      </div>

      {/* Todo List (col-md-4) + Daily Active Users (col-md-4) + Weather (col-md-4) */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <TodoList />
        <DailyActiveUsers />
        <WeatherWidget />
      </div>
    </div>
  )
}

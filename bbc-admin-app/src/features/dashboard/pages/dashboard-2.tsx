import { KpiCards } from '../components/d2/kpi-cards'
import { TransactionSummary } from '../components/d2/transaction-summary'
import { WeeklySales } from '../components/d2/weekly-sales'
import { SalesDistribution } from '../components/d2/sales-distribution'
import { DailyActivity } from '../components/d2/daily-activity'
import { PerformanceMetrics } from '../components/d2/performance-metrics'
import { RecentActivity } from '../components/d2/recent-activity'
import { CustomerReviews } from '../components/d2/customer-reviews'
import { SystemMonitor } from '../components/d2/system-monitor'

export function Dashboard2() {
  return (
    <div className='space-y-6'>
      {/* KPI cards — full width */}
      <KpiCards />

      {/* Transaction Summary — full width (handles 8+4 grid internally) */}
      <TransactionSummary />

      {/* Weekly Summary row: Sales Trend (col-md-6) + Distribution (col-md-3) + Activity (col-md-3) */}
      <div className='grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-6'>
          <WeeklySales />
        </div>
        <div className='lg:col-span-3'>
          <SalesDistribution />
        </div>
        <div className='lg:col-span-3'>
          <DailyActivity />
        </div>
      </div>

      {/* Performance (col-md-6) + Recent Activity (col-md-3) + Customer Reviews (col-md-3) */}
      <div className='grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-6'>
          <PerformanceMetrics />
        </div>
        <div className='lg:col-span-3'>
          <RecentActivity />
        </div>
        <div className='lg:col-span-3'>
          <CustomerReviews />
        </div>
      </div>

      {/* System Monitor — full width */}
      <SystemMonitor />
    </div>
  )
}

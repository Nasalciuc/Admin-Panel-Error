import { KpiCards } from '../components/d4/kpi-cards'
import { SalesStatistics } from '../components/d4/sales-statistics'
import { WeeklySales } from '../components/d4/weekly-sales'
import { TopProductsList } from '../components/d4/top-products-list'
import { RevenueLocation } from '../components/d4/revenue-location'
import { LatestOrders } from '../components/d4/latest-orders'

export function Dashboard4() {
  return (
    <div className='space-y-6'>
      {/* KPI cards — full width */}
      <KpiCards />

      {/* Sales Statistics (col-md-6) + Weekly Sales (col-md-6) */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <SalesStatistics />
        <WeeklySales />
      </div>

      {/* Top Products List (col-md-4) + Revenue Location (col-md-8) */}
      <div className='grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-4'>
          <TopProductsList />
        </div>
        <div className='lg:col-span-8'>
          <RevenueLocation />
        </div>
      </div>

      {/* Latest Orders — full width */}
      <LatestOrders />
    </div>
  )
}

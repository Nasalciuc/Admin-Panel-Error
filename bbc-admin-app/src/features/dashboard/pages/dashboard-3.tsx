import { KpiTiles } from '../components/d3/kpi-tiles'
import { SalesOverview } from '../components/d3/sales-overview'
import { RevenueBreakdown } from '../components/d3/revenue-breakdown'
import { TopProducts } from '../components/d3/top-products'
import { ConversionFunnel } from '../components/d3/conversion-funnel'
import { TrafficSources } from '../components/d3/traffic-sources'
import { OrdersAnalytics } from '../components/d3/orders-analytics'

export function Dashboard3() {
  return (
    <div className='space-y-6'>
      {/* KPI tiles — full width */}
      <KpiTiles />

      {/* Sales Overview (col-md-8) + Revenue Breakdown (col-md-4) */}
      <div className='grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <SalesOverview />
        </div>
        <div className='lg:col-span-4'>
          <RevenueBreakdown />
        </div>
      </div>

      {/* Top Products (col-md-4) + Conversion Funnel (col-md-4) + Traffic Sources (col-md-4) */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <TopProducts />
        <ConversionFunnel />
        <TrafficSources />
      </div>

      {/* Orders Analytics — full width */}
      <OrdersAnalytics />
    </div>
  )
}

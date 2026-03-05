import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'
import {
  ordersAnalyticsLabels, ordersVolumeData, ordersValueData,
  orderStatusData,
  d3RecentOrders,
  d3SalesAnalytics, d3SalesProgress,
} from '../../data/gentelella-data'

const trendData = ordersAnalyticsLabels.map((day, i) => ({
  day,
  Volume: ordersVolumeData[i],
  'Value ($)': ordersValueData[i],
}))

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-500 text-white hover:bg-green-500',
  Pending: 'bg-amber-500 text-black hover:bg-amber-500',
  Shipped: 'bg-cyan-500 text-white hover:bg-cyan-500',
  Cancelled: 'bg-red-500 text-white hover:bg-red-500',
}

export function OrdersAnalytics() {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Orders Analytics Dashboard</CardTitle>
          <CardDescription>Real-time order insights</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Daily Order Trends */}
          <div>
            <h4 className='mb-1 text-sm font-semibold'>Daily Order Trends</h4>
            <p className='mb-3 text-xs text-muted-foreground'>Orders volume and value over the last 30 days</p>
            <ResponsiveContainer width='100%' height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id='volGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#1ABB9C' stopOpacity={0.1} />
                    <stop offset='95%' stopColor='#1ABB9C' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
                <XAxis dataKey='day' fontSize={10} interval={4} />
                <YAxis yAxisId='left' fontSize={10} label={{ value: 'Order Count', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <YAxis yAxisId='right' orientation='right' fontSize={10} label={{ value: 'Order Value ($)', angle: 90, position: 'insideRight', fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Area yAxisId='left' type='monotone' dataKey='Volume' stroke='#1ABB9C' fill='url(#volGrad)' strokeWidth={2} name='Order Volume' />
                <Area yAxisId='right' type='monotone' dataKey='Value ($)' stroke='#E67E22' fill='rgba(230,126,34,0.1)' strokeWidth={2} name='Order Value ($)' />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status donut */}
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <h4 className='mb-1 text-sm font-semibold'>Order Status</h4>
              <p className='mb-2 text-xs text-muted-foreground'>Distribution of current orders</p>
              <ResponsiveContainer width='100%' height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={40}
                    outerRadius={70}
                    strokeWidth={2}
                    paddingAngle={2}
                  >
                    {orderStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${Number(v)}%`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sales Analytics */}
            <div>
              <h4 className='mb-1 text-sm font-semibold'>Sales Analytics</h4>
              <p className='mb-2 text-xs text-muted-foreground'>This month&apos;s performance</p>
              <div className='mb-3 flex gap-6'>
                <div>
                  <p className='text-2xl font-bold text-cyan-500'>{d3SalesAnalytics.totalSales}</p>
                  <p className='text-xs text-muted-foreground'>Total Sales</p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-green-500'>{d3SalesAnalytics.growthRate}</p>
                  <p className='text-xs text-muted-foreground'>Growth Rate</p>
                </div>
              </div>
              <div className='space-y-3'>
                {d3SalesProgress.map((p) => (
                  <div key={p.label} className='space-y-1'>
                    <div className='flex justify-between text-sm'>
                      <span>{p.label}</span>
                      <span className='font-medium'>{p.percent}%</span>
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders List */}
      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 8 orders</CardDescription>
          </div>
          <Badge>Live</Badge>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {d3RecentOrders.map((o) => (
              <div key={o.orderId} className='flex items-center justify-between rounded-lg border p-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
                    {o.customer.charAt(0)}
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{o.orderId} — {o.customer}</p>
                    <p className='text-xs text-muted-foreground'>{o.agent} · {o.time}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-semibold'>{o.amount}</span>
                  <Badge className={statusStyles[o.status]}>{o.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

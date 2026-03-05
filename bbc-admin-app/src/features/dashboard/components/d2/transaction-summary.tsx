import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  transactionSummaryLabels,
  transactionSummaryDatasets,
  transactionTiles,
  topAgent,
  teamProgress,
  quickStats,
} from '../../data/gentelella-data'

const chartData = transactionSummaryLabels.map((label, i) => ({
  month: label,
  Sales: transactionSummaryDatasets[0].data[i],
  Revenue: transactionSummaryDatasets[1].data[i],
}))

export function TransactionSummary() {
  return (
    <div className='grid gap-4 lg:grid-cols-12'>
      {/* Chart + tiles (8 cols) */}
      <Card className='lg:col-span-8'>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Weekly progress</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ResponsiveContainer width='100%' height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='salesGrad2' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#E74C3C' stopOpacity={0.1} />
                  <stop offset='95%' stopColor='#E74C3C' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='revenueGrad2' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#3498DB' stopOpacity={0.1} />
                  <stop offset='95%' stopColor='#3498DB' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
              <XAxis dataKey='month' fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type='monotone' dataKey='Sales' stroke='#E74C3C' fill='url(#salesGrad2)' strokeWidth={2} />
              <Area type='monotone' dataKey='Revenue' stroke='#3498DB' fill='url(#revenueGrad2)' strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Summary tiles */}
          <div className='grid grid-cols-3 gap-4 border-t pt-4'>
            {transactionTiles.map((t) => (
              <div key={t.label} className='text-center'>
                <p className='text-lg font-bold'>{t.value}</p>
                <p className='text-xs text-muted-foreground'>{t.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Right sidebar (4 cols) */}
      <Card className='lg:col-span-4'>
        <CardContent className='space-y-6 p-6'>
          {/* Top Agent */}
          <div className='text-center'>
            <p className='text-sm font-medium text-muted-foreground'>🏆 Top Agent</p>
            <p className='mt-1 text-lg font-bold'>{topAgent.name}</p>
            <p className='text-sm font-semibold text-green-500'>{topAgent.revenue}</p>
            <p className='text-xs text-muted-foreground'>{topAgent.sales}</p>
          </div>

          {/* Team Progress */}
          <div className='space-y-3'>
            {teamProgress.map((p) => (
              <div key={p.label} className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span>{p.label}</span>
                  <span className='font-medium'>{p.percent}%</span>
                </div>
                <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-2 gap-3'>
            {quickStats.map((s) => (
              <div key={s.label} className='text-center'>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className='text-xs text-muted-foreground'>{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

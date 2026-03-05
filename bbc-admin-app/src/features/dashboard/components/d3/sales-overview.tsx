import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { salesOverviewLabels, salesOverviewData } from '../../data/gentelella-data'

const chartData = salesOverviewLabels.map((month, i) => ({
  month,
  sales: salesOverviewData[i],
}))

export function SalesOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='salesOverGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#1ABB9C' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#1ABB9C' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='month' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area type='monotone' dataKey='sales' stroke='#1ABB9C' fill='url(#salesOverGrad)' strokeWidth={3} name='Sales Overview' />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

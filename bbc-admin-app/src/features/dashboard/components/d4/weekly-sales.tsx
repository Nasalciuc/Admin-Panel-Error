import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { d4WeeklySalesLabels, d4WeeklySalesData } from '../../data/gentelella-data'

const chartData = d4WeeklySalesLabels.map((day, i) => ({
  day,
  sales: d4WeeklySalesData[i],
}))

export function WeeklySales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Sales</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='weeklyGrad4' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#1ABB9C' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#1ABB9C' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='day' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area type='monotone' dataKey='sales' stroke='#1ABB9C' fill='url(#weeklyGrad4)' strokeWidth={2} name='Weekly Sales' />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

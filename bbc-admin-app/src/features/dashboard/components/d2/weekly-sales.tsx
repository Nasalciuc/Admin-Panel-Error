import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { weeklySalesLabels, weeklySalesData } from '../../data/gentelella-data'

const chartData = weeklySalesLabels.map((day, i) => ({
  day,
  sales: weeklySalesData[i],
}))

export function WeeklySales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Sales Trend</CardTitle>
        <CardDescription>Weekly Summary — Activity shares</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='weeklyGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#1ABB9C' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#1ABB9C' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='day' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area type='monotone' dataKey='sales' stroke='#1ABB9C' fill='url(#weeklyGrad)' strokeWidth={2} name='Weekly Sales' />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

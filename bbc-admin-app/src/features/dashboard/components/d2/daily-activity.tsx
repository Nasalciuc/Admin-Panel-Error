import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dailyActivityLabels, dailyActivityData } from '../../data/gentelella-data'

const chartData = dailyActivityLabels.map((time, i) => ({
  time,
  activity: dailyActivityData[i],
}))

export function DailyActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='activityGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#9B59B6' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#9B59B6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='time' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area type='monotone' dataKey='activity' stroke='#9B59B6' fill='url(#activityGrad)' strokeWidth={2} name='User Activity' />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

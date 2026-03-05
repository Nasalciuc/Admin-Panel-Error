import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { networkActivitiesLabels, networkActivitiesDatasets } from '../../data/gentelella-data'

const chartData = networkActivitiesLabels.map((label, i) => ({
  month: label,
  Revenue: networkActivitiesDatasets[0].data[i],
  Expenses: networkActivitiesDatasets[1].data[i],
}))

export function NetworkActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Activities</CardTitle>
        <CardDescription>Monthly Financial Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='revenueGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#1ABB9C' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#1ABB9C' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='expensesGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#E74C3C' stopOpacity={0.1} />
                <stop offset='95%' stopColor='#E74C3C' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='month' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Area type='monotone' dataKey='Revenue' stroke='#1ABB9C' fill='url(#revenueGrad)' strokeWidth={2} />
            <Area type='monotone' dataKey='Expenses' stroke='#E74C3C' fill='url(#expensesGrad)' strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

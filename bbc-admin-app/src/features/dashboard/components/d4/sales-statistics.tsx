import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { d4SalesStatsLabels, d4SalesStatsData, d4SalesStatsColors } from '../../data/gentelella-data'

const chartData = d4SalesStatsLabels.map((name, i) => ({
  name,
  sales: d4SalesStatsData[i],
  fill: d4SalesStatsColors[i],
}))

export function SalesStatistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Statistics</CardTitle>
        <CardDescription>Sales vs Orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='name' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(v) => [Number(v).toLocaleString(), 'Sales']} />
            <Bar dataKey='sales' name='Sales Statistics' radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

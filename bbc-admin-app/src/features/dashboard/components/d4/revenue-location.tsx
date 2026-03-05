import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { revenueByLocationLabels, revenueByLocationData, revenueByLocationColors } from '../../data/gentelella-data'

const chartData = revenueByLocationLabels.map((name, i) => ({
  name,
  revenue: revenueByLocationData[i],
  fill: revenueByLocationColors[i],
}))

export function RevenueLocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Location</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='name' fontSize={10} />
            <YAxis fontSize={11} label={{ value: 'Revenue ($000s)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}k`, 'Revenue']} />
            <Bar dataKey='revenue' name='Revenue by Region ($000s)' radius={[4, 4, 0, 0]}>
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

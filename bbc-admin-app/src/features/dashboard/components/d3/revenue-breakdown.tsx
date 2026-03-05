import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { revenueBreakdownData } from '../../data/gentelella-data'

export function RevenueBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <PieChart>
            <Pie
              data={revenueBreakdownData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={50}
              outerRadius={85}
              strokeWidth={2}
              paddingAngle={2}
            >
              {revenueBreakdownData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${Number(v)}%`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

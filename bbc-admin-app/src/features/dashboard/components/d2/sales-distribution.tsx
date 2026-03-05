import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { salesDistributionData } from '../../data/gentelella-data'

export function SalesDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={220}>
          <PieChart>
            <Pie
              data={salesDistributionData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={80}
              strokeWidth={2}
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {salesDistributionData.map((entry) => (
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

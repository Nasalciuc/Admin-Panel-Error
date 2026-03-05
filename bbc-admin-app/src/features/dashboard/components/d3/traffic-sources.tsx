import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { trafficSourcesData } from '../../data/gentelella-data'

export function TrafficSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <PieChart>
            <Pie
              data={trafficSourcesData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={50}
              outerRadius={85}
              strokeWidth={2}
              paddingAngle={2}
            >
              {trafficSourcesData.map((entry) => (
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

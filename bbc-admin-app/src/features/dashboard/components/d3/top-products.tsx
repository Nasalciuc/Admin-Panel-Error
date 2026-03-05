import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { topProductsLabels, topProductsData, topProductsColors } from '../../data/gentelella-data'

const chartData = topProductsLabels.map((name, i) => ({
  name,
  sales: topProductsData[i],
  fill: topProductsColors[i],
}))

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis dataKey='name' fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip />
            <Bar dataKey='sales' name='Sales' radius={[4, 4, 0, 0]}>
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { conversionFunnelLabels, conversionFunnelData, conversionFunnelColors } from '../../data/gentelella-data'

const chartData = conversionFunnelLabels.map((name, i) => ({
  name,
  value: conversionFunnelData[i],
  fill: conversionFunnelColors[i],
}))

export function ConversionFunnel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={260}>
          <BarChart data={chartData} layout='vertical'>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,0,0,0.1)' />
            <XAxis type='number' fontSize={11} />
            <YAxis type='category' dataKey='name' fontSize={11} width={80} />
            <Tooltip />
            <Bar dataKey='value' name='Conversion Funnel' radius={[0, 4, 4, 0]}>
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

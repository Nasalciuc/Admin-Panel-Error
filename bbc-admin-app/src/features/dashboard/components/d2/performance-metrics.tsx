import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { performanceLabels, performanceDatasets } from '../../data/gentelella-data'

const chartData = performanceLabels.map((label, i) => ({
  metric: label,
  Current: performanceDatasets[0].data[i],
  Target: performanceDatasets[1].data[i],
}))

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={280}>
          <RadarChart data={chartData} cx='50%' cy='50%' outerRadius='75%'>
            <PolarGrid />
            <PolarAngleAxis dataKey='metric' fontSize={12} />
            <PolarRadiusAxis fontSize={10} domain={[0, 100]} />
            <Radar name='Current' dataKey='Current' stroke='#E67E22' fill='rgba(230, 126, 34, 0.2)' strokeWidth={2} />
            <Radar name='Target' dataKey='Target' stroke='#27AE60' fill='rgba(39, 174, 96, 0.2)' strokeWidth={2} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

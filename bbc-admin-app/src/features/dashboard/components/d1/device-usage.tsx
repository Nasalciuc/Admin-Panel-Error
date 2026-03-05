import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { deviceUsageData } from '../../data/gentelella-data'

export function DeviceUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={180}>
          <PieChart>
            <Pie
              data={deviceUsageData}
              dataKey='percentage'
              nameKey='device'
              cx='50%'
              cy='50%'
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
            >
              {deviceUsageData.map((entry) => (
                <Cell key={entry.device} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${Number(v)}%`, '']} />
          </PieChart>
        </ResponsiveContainer>
        <div className='mt-4 space-y-1'>
          {deviceUsageData.map((d) => (
            <div key={d.device} className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <span className='inline-block h-3 w-3 rounded-sm' style={{ backgroundColor: d.color }} />
                <span>{d.device}</span>
              </div>
              <span className='font-medium'>{d.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

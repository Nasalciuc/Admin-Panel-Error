import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const dauData = [
  { hour: '00', users: 120 }, { hour: '02', users: 85 }, { hour: '04', users: 60 },
  { hour: '06', users: 90 }, { hour: '08', users: 200 }, { hour: '10', users: 350 },
  { hour: '12', users: 450 }, { hour: '14', users: 380 }, { hour: '16', users: 420 },
  { hour: '18', users: 350 }, { hour: '20', users: 280 }, { hour: '22', users: 180 },
]

export function DailyActiveUsers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily active users</CardTitle>
        <CardDescription>Sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart data={dauData}>
            <XAxis dataKey='hour' fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip />
            <Bar dataKey='users' fill='#26B99A' radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

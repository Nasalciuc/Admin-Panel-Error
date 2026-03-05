import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, UserPlus, AlertTriangle, Database } from 'lucide-react'
import { d2RecentActivity } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  Check, UserPlus, AlertTriangle, Database,
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {d2RecentActivity.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Check
            return (
              <div key={i} className='flex items-start gap-3'>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${item.iconBg}`}>
                  <Icon className='h-4 w-4' />
                </div>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold'>{item.title}</p>
                  <p className='text-sm text-muted-foreground'>{item.description}</p>
                  <p className='mt-0.5 text-xs text-muted-foreground'>{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

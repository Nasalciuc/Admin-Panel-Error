import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { systemMonitorBars, systemStats } from '../../data/gentelella-data'

export function SystemMonitor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Monitor</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Progress bars */}
        {systemMonitorBars.map((bar) => (
          <div key={bar.label} className='space-y-1'>
            <div className='flex items-center justify-between text-sm'>
              <span>{bar.label}</span>
              <span className={`font-medium ${bar.statusColor}`}>{bar.statusText}</span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
              <div className={`h-full rounded-full ${bar.barColor}`} style={{ width: `${bar.barWidth}%` }} />
            </div>
          </div>
        ))}

        {/* Stats */}
        <div className='flex items-center justify-around border-t pt-4'>
          <div className='text-center'>
            <p className='text-lg font-bold text-green-500'>{systemStats.uptime}</p>
            <p className='text-xs text-muted-foreground'>System Uptime</p>
          </div>
          <div className='text-center'>
            <p className='text-lg font-bold text-blue-500'>{systemStats.responseTime}</p>
            <p className='text-xs text-muted-foreground'>Response Time</p>
          </div>
        </div>

        {/* Status badge */}
        <div className='flex justify-center'>
          <Badge className='bg-green-500 text-white hover:bg-green-500'>
            <Check className='mr-1 h-3 w-3' />
            All Systems Operational
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Menu, BarChart, TrendingUp, AreaChart } from 'lucide-react'
import { profileCompletion, quickSettings } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  Menu,
  BarChart,
  TrendingUp,
  AreaChart,
}

export function QuickSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Profile completion gauge */}
        <div className='flex flex-col items-center gap-2'>
          <div className='relative h-24 w-32'>
            <svg viewBox='0 0 160 120' className='h-full w-full'>
              <path
                d='M 20 100 A 60 60 0 0 1 140 100'
                fill='none'
                stroke='#ECF0F1'
                strokeWidth='12'
                strokeLinecap='round'
              />
              <path
                d='M 20 100 A 60 60 0 0 1 140 100'
                fill='none'
                stroke='#1ABB9C'
                strokeWidth='12'
                strokeLinecap='round'
                strokeDasharray={`${(profileCompletion / 100) * 188.5} 188.5`}
              />
            </svg>
            <div className='absolute inset-0 flex items-center justify-center pt-4'>
              <span className='text-xl font-bold'>{profileCompletion}%</span>
            </div>
          </div>
          <p className='text-sm text-muted-foreground'>Profile Completion</p>
        </div>

        {/* Settings list */}
        <div className='space-y-1'>
          {quickSettings.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Calendar
            return (
              <div key={`${item.label}-${i}`} className='flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted'>
                <Icon className='h-4 w-4 text-muted-foreground' />
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

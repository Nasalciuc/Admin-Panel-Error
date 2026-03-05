import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { UserPlus, ShoppingBag, TrendingUp } from 'lucide-react'
import { salesStatMetrics } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  UserPlus,
  ShoppingBag,
  TrendingUp,
}

export function SalesStatistics() {
  return (
    <Card className='min-h-[450px]'>
      <CardHeader>
        <CardTitle>Sales Statistics</CardTitle>
        <CardDescription>Monthly overview</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* SVG area chart */}
        <div className='relative'>
          <svg viewBox='0 0 280 80' className='w-full' preserveAspectRatio='none'>
            <defs>
              <linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#26B99A' stopOpacity={0.3} />
                <stop offset='100%' stopColor='#26B99A' stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <path d='M 20 60 Q 70 40 120 30 T 260 20 L 260 70 L 20 70 Z' fill='url(#salesGradient)' />
            <path d='M 20 60 Q 70 40 120 30 T 260 20' fill='none' stroke='#26B99A' strokeWidth={2.5} />
            <circle cx={20} cy={60} r={3} fill='#26B99A' />
            <circle cx={70} cy={40} r={3} fill='#26B99A' />
            <circle cx={120} cy={30} r={4} fill='#26B99A' />
            <circle cx={180} cy={25} r={3} fill='#26B99A' />
            <circle cx={260} cy={20} r={3} fill='#26B99A' />
          </svg>
          {/* Floating info card */}
          <div className='absolute right-8 top-2 rounded-md border bg-card px-3 py-1.5 shadow-sm'>
            <p className='text-xs text-muted-foreground'>March</p>
            <p className='text-sm font-bold'>$45k profit</p>
          </div>
        </div>

        {/* 4 Metric boxes */}
        <div className='grid grid-cols-2 gap-3'>
          {salesStatMetrics.map((m) => {
            const Icon = iconMap[m.icon]
            return (
              <div
                key={m.title}
                className='rounded-md border border-[#E6E9ED] p-3'
                style={{ backgroundColor: '#f7f7f7' }}
              >
                <div className='flex items-center gap-2'>
                  {m.icon === 'dots' ? (
                    <div className='flex gap-1'>
                      <span className='inline-block h-2.5 w-2.5 rounded-full' style={{ backgroundColor: '#26B99A' }} />
                      <span className='inline-block h-2.5 w-2.5 rounded-full' style={{ backgroundColor: '#3498DB' }} />
                      <span className='inline-block h-2.5 w-2.5 rounded-full' style={{ backgroundColor: '#E74C3C' }} />
                    </div>
                  ) : Icon ? (
                    <Icon className='h-4 w-4' style={{ color: m.iconColor }} />
                  ) : null}
                </div>
                <p className='mt-2 text-sm font-semibold' style={{ color: '#2A3F54' }}>{m.title}</p>
                <p className='text-xs' style={{ color: '#73879C' }}>{m.value}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

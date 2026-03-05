import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ShoppingCart, UserPlus, CreditCard, Star, Truck, TrendingUp, AlertTriangle,
} from 'lucide-react'
import { recentActivities } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  ShoppingCart, UserPlus, CreditCard, Star, Truck, TrendingUp, AlertTriangle,
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='relative ml-4 border-l border-border pl-6'>
          {recentActivities.map((item, i) => {
            const Icon = iconMap[item.icon] ?? ShoppingCart
            return (
              <div key={i} className='relative mb-6 last:mb-0'>
                {/* dot on the timeline */}
                <div
                  className='absolute -left-[33px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-background'
                  style={{ backgroundColor: item.iconColor }}
                >
                  <Icon className='h-4 w-4 text-white' />
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-baseline gap-2'>
                    <span className='font-semibold'>{item.title}</span>
                    <span className='text-xs text-muted-foreground'>— {item.source}</span>
                  </div>
                  <span className='text-xs text-muted-foreground'>{item.time}</span>
                  <p className='text-sm text-muted-foreground'>{item.description}</p>
                  <button className='mt-1 w-fit text-xs font-medium text-blue-500 hover:underline'>
                    {item.linkText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

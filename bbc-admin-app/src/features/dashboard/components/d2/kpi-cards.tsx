import { Card, CardContent } from '@/components/ui/card'
import { UserPlus, MessageSquare, BarChart3, CheckSquare } from 'lucide-react'
import { d2KpiCards } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  UserPlus, MessageSquare, BarChart3, CheckSquare,
}

export function KpiCards() {
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {d2KpiCards.map((card) => {
        const Icon = iconMap[card.icon] ?? UserPlus
        return (
          <Card key={card.label}>
            <CardContent className='flex items-center gap-4 p-4'>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon className='h-5 w-5' style={{ color: card.iconColor }} />
              </div>
              <div className='min-w-0'>
                <p className='text-2xl font-bold'>{card.value}</p>
                <p className='text-sm font-medium'>{card.label}</p>
                <p className='text-xs text-muted-foreground'>{card.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

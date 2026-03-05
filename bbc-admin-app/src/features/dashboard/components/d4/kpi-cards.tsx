import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, ShoppingCart, Users } from 'lucide-react'
import { d4KpiCards } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  DollarSign, TrendingUp, ShoppingCart, Users,
}

export function KpiCards() {
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {d4KpiCards.map((card) => {
        const Icon = iconMap[card.icon] ?? DollarSign
        return (
          <Card key={card.label}>
            <CardContent className='flex items-center gap-4 p-4'>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon className='h-5 w-5' style={{ color: card.iconColor }} />
              </div>
              <div className='min-w-0'>
                <p className='text-xl font-bold'>{card.value}</p>
                <p className='text-sm font-medium'>{card.label}</p>
                <div className={`flex items-center gap-1 text-xs ${card.trendColor}`}>
                  {card.trendDirection === 'up' ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
                  <span>{card.trendPercent}%</span>
                  <span className='text-muted-foreground'>{card.trendText}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

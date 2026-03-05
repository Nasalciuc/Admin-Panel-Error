import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Users, Clock, ShoppingCart, DollarSign, TrendingUp, Eye } from 'lucide-react'
import { d1KpiTiles } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  'Total Users': Users,
  'Average Time': Clock,
  'Total Orders': ShoppingCart,
  'Total Revenue': DollarSign,
  'Conversions': TrendingUp,
  'Page Views': Eye,
}

export function KpiTiles() {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
      {d1KpiTiles.map((tile) => {
        const Icon = iconMap[tile.label] ?? Users
        return (
          <Card key={tile.label}>
            <CardContent className='flex flex-col items-center gap-2 p-4 text-center'>
              <div
                className='flex h-12 w-12 items-center justify-center rounded-full text-white'
                style={{ backgroundColor: tile.iconColor }}
              >
                <Icon className='h-5 w-5' />
              </div>
              <p className='text-xs font-medium uppercase text-muted-foreground'>{tile.label}</p>
              <p className='text-xl font-bold'>
                {tile.value}
                {tile.unit && <span className='ml-1 text-sm font-normal text-muted-foreground'>{tile.unit}</span>}
              </p>
              <div className={`flex items-center gap-1 text-xs ${tile.trendColor}`}>
                {tile.trendDirection === 'up' ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />}
                <span>{tile.trendPercent}%</span>
                <span className='text-muted-foreground'>{tile.trendText}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

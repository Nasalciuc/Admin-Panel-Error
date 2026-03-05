import { Card, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, User, Clock, UserCheck, Users as UsersIcon, Archive, Users } from 'lucide-react'
import { d3KpiTiles } from '../../data/gentelella-data'

const iconMap: Record<string, React.ElementType> = {
  'Total Users': User,
  'Average Time': Clock,
  'Total Males': UserCheck,
  'Total Females': UsersIcon,
  'Collections': Archive,
  'Connections': Users,
}

export function KpiTiles() {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
      {d3KpiTiles.map((tile) => {
        const Icon = iconMap[tile.label] ?? User
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
              <p className='text-xl font-bold'>{tile.value}</p>
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { topProductsList } from '../../data/gentelella-data'

export function TopProductsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-0 divide-y'>
          {topProductsList.map((p, i) => (
            <div key={i} className='flex items-center justify-between py-3 first:pt-0 last:pb-0'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold'>
                  {i + 1}
                </div>
                <div>
                  <p className='text-sm font-semibold'>{p.name}</p>
                  <p className='text-xs text-muted-foreground'>{p.category}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-bold text-green-500'>{p.price}</p>
                <p className='text-xs text-muted-foreground'>{p.unitsSold}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

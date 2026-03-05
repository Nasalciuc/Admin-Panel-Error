import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, MessageSquare } from 'lucide-react'
import { customerReviews, reviewSummary } from '../../data/gentelella-data'

export function CustomerReviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {customerReviews.map((r) => (
          <div key={r.name} className='space-y-2 border-b pb-4 last:border-0 last:pb-0'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold'>
                {r.name.charAt(0)}
              </div>
              <div>
                <p className='text-sm font-semibold'>{r.name}</p>
                <div className='flex gap-0.5'>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className='text-sm text-muted-foreground'>{r.text}</p>
          </div>
        ))}

        {/* Summary */}
        <div className='flex items-center justify-around border-t pt-4'>
          <div className='flex items-center gap-2'>
            <Star className='h-5 w-5 text-green-500' />
            <div>
              <p className='text-lg font-bold text-green-500'>{reviewSummary.averageRating}</p>
              <p className='text-xs text-muted-foreground'>Average Rating</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5 text-blue-500' />
            <div>
              <p className='text-lg font-bold text-blue-500'>{reviewSummary.totalReviews}</p>
              <p className='text-xs text-muted-foreground'>Total Reviews</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

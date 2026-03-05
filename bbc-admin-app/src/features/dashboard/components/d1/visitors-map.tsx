import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { visitorCountries, visitorsSummary } from '../../data/gentelella-data'

export function VisitorsMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors location</CardTitle>
        <CardDescription>geo-presentation</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-semibold text-foreground'>{visitorsSummary.views}</span> Views from{' '}
          <span className='font-semibold text-foreground'>{visitorsSummary.countries}</span> countries
        </p>

        {/* Map placeholder */}
        <div className='flex h-[230px] items-center justify-center rounded-md bg-muted text-sm text-muted-foreground'>
          {/* TODO: integrate react-simple-maps or a vector map library */}
          World Map Placeholder
        </div>

        {/* Country stats */}
        <div className='space-y-2'>
          {visitorCountries.map((c) => (
            <div key={c.country} className='flex items-center justify-between text-sm'>
              <span>{c.country}</span>
              <span className='font-bold'>{c.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

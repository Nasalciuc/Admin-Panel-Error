import { Card, CardContent } from '@/components/ui/card'
import { Sun, CloudRain, CloudSnow, CloudHail, Wind, Cloud, CloudSun } from 'lucide-react'
import { weatherCurrent, weatherForecast } from '../../data/gentelella-data'

const weatherIcons: Record<string, React.ElementType> = {
  Sun, CloudRain, CloudSnow, CloudHail, Wind, Cloud, CloudSun,
}

export function WeatherWidget() {
  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0'>
        {/* Current weather */}
        <div className='bg-gradient-to-br from-[#1ABB9C] to-[#2ECC71] p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-80'>{weatherCurrent.day}, {weatherCurrent.time}</p>
              <p className='text-sm opacity-80'>{weatherCurrent.location}</p>
              <p className='mt-1 text-xs opacity-70'>{weatherCurrent.condition}</p>
            </div>
            <div className='flex items-center gap-3'>
              <CloudSun className='h-16 w-16 opacity-90' />
              <span className='text-5xl font-light'>{weatherCurrent.temp}°</span>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className='grid grid-cols-6 divide-x text-center'>
          {weatherForecast.map((f) => {
            const Icon = weatherIcons[f.icon] ?? Sun
            return (
              <div key={f.day} className='p-3'>
                <p className='text-xs font-medium text-muted-foreground'>{f.day}</p>
                <Icon className='mx-auto my-1.5 h-6 w-6 text-muted-foreground' />
                <p className='text-sm font-semibold'>{f.degrees}°</p>
                <p className='text-[10px] text-muted-foreground'>{f.wind}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

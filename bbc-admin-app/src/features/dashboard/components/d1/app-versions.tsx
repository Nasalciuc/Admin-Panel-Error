import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { appVersions } from '../../data/gentelella-data'

export function AppVersions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Versions</CardTitle>
        <CardDescription>App Usage across versions</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {appVersions.map((v) => (
          <div key={v.version} className='flex items-center gap-3'>
            <span className='w-14 text-sm font-medium text-muted-foreground'>{v.version}</span>
            <div className='flex-1'>
              <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-[#26B99A]'
                  style={{ width: `${v.progressWidth}%` }}
                />
              </div>
            </div>
            <span className='w-10 text-right text-sm font-semibold'>{v.userCount}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

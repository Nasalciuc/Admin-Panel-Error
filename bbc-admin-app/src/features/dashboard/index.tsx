import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConnectionBanner } from '@/components/connection-banner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Dashboard1 } from './pages/dashboard-1'
import { Dashboard2 } from './pages/dashboard-2'
import { Dashboard3 } from './pages/dashboard-3'
import { Dashboard4 } from './pages/dashboard-4'

export function Dashboard() {
  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ConnectionBanner />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='space-y-6'>
          {/* TITLE ROW */}
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              Welcome to your admin dashboard
            </p>
          </div>

          {/* TABBED DASHBOARDS */}
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='activity'>Activity</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='sales'>Sales</TabsTrigger>
            </TabsList>

            {/* TAB 1: Overview (Gentelella Dashboard 1) */}
            <TabsContent value='overview' className='mt-4'>
              <Dashboard1 />
            </TabsContent>

            {/* TAB 2: Activity (Gentelella Dashboard 2) */}
            <TabsContent value='activity' className='mt-4'>
              <Dashboard2 />
            </TabsContent>

            {/* TAB 3: Analytics (Gentelella Dashboard 3) */}
            <TabsContent value='analytics' className='mt-4'>
              <Dashboard3 />
            </TabsContent>

            {/* TAB 4: Sales (Gentelella Dashboard 4) */}
            <TabsContent value='sales' className='mt-4'>
              <Dashboard4 />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}

import { useState, useEffect } from 'react'
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
import { getDashboardStats } from '@/lib/api'
import type { DashboardStats } from '@/lib/types'
import { AlertBanner } from './components/alert-banner'
import { KpiCards } from './components/kpi-cards'
import { ConversationsTrend } from './components/conversations-trend'
import { HotLeads } from './components/hot-leads'
import { TopRoutes } from './components/top-routes'
import { LeadFunnel } from './components/lead-funnel'
import { AiHealthIndicator } from './components/ai-health-indicator'
import { Dashboard1 } from './pages/dashboard-1'
import { Dashboard2 } from './pages/dashboard-2'
import { Dashboard3 } from './pages/dashboard-3'
import { Dashboard4 } from './pages/dashboard-4'

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

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
              BBC AI Chatbot — Admin Overview
            </p>
          </div>

          {/* TABBED DASHBOARDS */}
          <Tabs defaultValue='bbc-overview' className='w-full'>
            <TabsList>
              <TabsTrigger value='bbc-overview'>BBC Overview</TabsTrigger>
              <TabsTrigger value='overview'>General</TabsTrigger>
              <TabsTrigger value='activity'>Activity</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='sales'>Sales</TabsTrigger>
            </TabsList>

            {/* TAB 0: BBC Overview — live stats from API */}
            <TabsContent value='bbc-overview' className='mt-4'>
              {stats ? (
                <div className='space-y-6'>
                  <AlertBanner
                    latency_median_ms={stats.latency_median_ms}
                    fallback_rate_percent={stats.fallback_rate_percent}
                    cost_vs_budget_percent={stats.cost_vs_budget_percent}
                  />
                  <KpiCards
                    leads_uncalled={stats.leads_uncalled}
                    leads_sla_breach={stats.leads_sla_breach}
                    conversations_today={stats.conversations_today}
                    conversations_yesterday={stats.conversations_yesterday}
                    conversations_active={stats.conversations_active}
                    leads_gold={stats.leads_gold}
                    leads_silver={stats.leads_silver}
                    leads_bronze={stats.leads_bronze}
                    leads_sparkline_7d={stats.leads_sparkline_7d}
                    cost_today={stats.cost_today}
                    cost_avg_30d={stats.cost_avg_30d}
                    daily_budget={stats.daily_budget}
                  />
                  <div className='grid gap-6 md:grid-cols-2'>
                    <ConversationsTrend conversations_trend_v2={stats.conversations_trend_v2} />
                    <LeadFunnel funnel={stats.funnel} />
                  </div>
                  <div className='grid gap-6 md:grid-cols-2'>
                    <HotLeads hot_leads={stats.hot_leads} />
                    <div className='space-y-6'>
                      <TopRoutes top_routes={stats.top_routes} />
                      <AiHealthIndicator
                        latency_median_ms={stats.latency_median_ms}
                        fallback_rate_percent={stats.fallback_rate_percent}
                        cost_vs_budget_percent={stats.cost_vs_budget_percent}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center py-16 text-sm text-muted-foreground'>
                  Loading dashboard stats...
                </div>
              )}
            </TabsContent>

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

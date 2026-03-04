import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'
import { MessageSquare, Users, TrendingUp, DollarSign, RefreshCw, Plane, AlertCircle } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'
import { MOCK_STATS } from '@/lib/mock-data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function StatCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; accent?: boolean
}) {
  return (
    <div className={`rounded-xl p-5 border shadow-sm ${accent ? 'bg-[#0B1829] border-[#0B1829]' : 'bg-white border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${accent ? 'text-[#C9A54E]' : 'text-gray-500'}`}>{label}</p>
          <p className={`text-3xl font-bold mt-1 ${accent ? 'text-white' : 'text-[#0B1829]'}`}>{value}</p>
          {sub && <p className="text-xs mt-1 text-gray-400">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${accent ? 'bg-white/10' : 'bg-[#0B1829]/5'}`}>
          <Icon className={`w-5 h-5 ${accent ? 'text-[#C9A54E]' : 'text-[#0B1829]'}`} />
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [stats, setStats]         = useState<DashboardStats | null>(null)
  const [loading, setLoading]     = useState(true)
  const [usingMock, setMock]      = useState(false)
  const [lastRefresh, setRefresh] = useState(new Date())

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/dashboard/stats`, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) throw new Error()
      setStats(await res.json()); setMock(false)
    } catch {
      setStats(MOCK_STATS); setMock(true)
    } finally { setLoading(false); setRefresh(new Date()) }
  }

  useEffect(() => { fetchStats() }, [])

  if (loading && !stats) return (
    <>
      <Header><div className='ms-auto flex items-center space-x-4'><ThemeSwitch /><ProfileDropdown /></div></Header>
      <Main>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 animate-spin text-[#C9A54E]" />
        </div>
      </Main>
    </>
  )
  if (!stats) return null

  const tierData = [
    { name: 'Gold',   value: stats.leads_gold,   color: '#C9A54E' },
    { name: 'Silver', value: stats.leads_silver,  color: '#94a3b8' },
    { name: 'Bronze', value: stats.leads_bronze,  color: '#f97316' },
  ].filter(d => d.value > 0)

  const statusData = [
    { name: 'New',       count: stats.leads_new,       fill: '#3b82f6' },
    { name: 'Contacted', count: stats.leads_contacted, fill: '#8b5cf6' },
    { name: 'Qualified', count: stats.leads_qualified, fill: '#6366f1' },
    { name: 'Converted', count: stats.leads_converted, fill: '#22c55e' },
    { name: 'Lost',      count: stats.leads_lost,      fill: '#ef4444' },
  ]

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="space-y-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0B1829]">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Updated {lastRefresh.toLocaleTimeString()}
                {usingMock && (
                  <span className="ml-2 inline-flex items-center gap-1 text-amber-500">
                    <AlertCircle className="w-3 h-3" /> mock data (API offline)
                  </span>
                )}
              </p>
            </div>
            <button onClick={fetchStats} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0B1829] rounded-lg hover:bg-[#0B1829]/90 transition disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh
            </button>
          </div>

          {/* Conversations row */}
          <div>
            <p className="text-xs font-semibold text-[#0B1829] uppercase tracking-wide mb-3">Conversations</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Active Now"    value={stats.conversations_active}  icon={MessageSquare} accent />
              <StatCard label="Today"         value={stats.conversations_today}   sub={`${stats.conversations_week} this week`} icon={MessageSquare} />
              <StatCard label="This Month"    value={stats.conversations_month}   icon={TrendingUp} />
              <StatCard label="AI Cost Today" value={`$${stats.cost_today.toFixed(2)}`} sub={`$${stats.cost_month.toFixed(2)} this month`} icon={DollarSign} />
            </div>
          </div>

          {/* Leads row */}
          <div>
            <p className="text-xs font-semibold text-[#0B1829] uppercase tracking-wide mb-3">Leads</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Leads" value={stats.leads_total}     icon={Users} />
              <StatCard label="New"         value={stats.leads_new}       icon={Users} />
              <StatCard label="Converted"   value={stats.leads_converted} icon={TrendingUp} accent />
              <StatCard label="Gold Leads"  value={stats.leads_gold} sub={`${stats.leads_silver} silver · ${stats.leads_bronze} bronze`} icon={Users} />
            </div>
          </div>

          {/* Charts row 1: trend line + tier pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-[#0B1829] mb-4">Conversations — Last 7 Days</h3>
              {stats.conversations_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={stats.conversations_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                    <Tooltip formatter={(v) => [v ?? 0, 'Conversations']} contentStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="#C9A54E" strokeWidth={2.5}
                      dot={{ fill: '#C9A54E', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div className="h-44 flex items-center justify-center text-gray-300 text-sm">No trend data yet</div>}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-[#0B1829] mb-4">Lead Tier Distribution</h3>
              {tierData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={tierData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {tierData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v ?? 0, n]} contentStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {tierData.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-500">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <div className="h-44 flex items-center justify-center text-gray-300 text-sm">No leads yet</div>}
            </div>
          </div>

          {/* Charts row 2: status bar + top routes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-[#0B1829] mb-4">Leads by Status</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={statusData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                  <Tooltip formatter={(v) => [v ?? 0, 'Leads']} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-[#0B1829] mb-4">Top Routes</h3>
              {stats.top_routes.length > 0 ? (
                <div className="space-y-2.5">
                  {stats.top_routes.map((r, i) => {
                    const maxCount = stats.top_routes[0].count
                    return (
                      <div key={r.route} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-400 w-4 text-right">{i + 1}</span>
                        <Plane className="w-3.5 h-3.5 text-[#C9A54E] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">{r.route}</span>
                            <span className="text-xs text-gray-400">{r.count}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C9A54E] rounded-full transition-all duration-500"
                              style={{ width: `${(r.count / maxCount) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                  <Plane className="w-6 h-6 mb-1 opacity-30" /><p className="text-sm">No route data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

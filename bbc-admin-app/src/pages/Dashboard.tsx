import { TrendingUp, MessageSquare, Users, Clock, Database } from 'lucide-react'
import { dashboardStats, conversations, kbHealth, leads } from '../data/mock'

// ── Stat Card ──────────────────────────────────────────────────────

function StatCard({
  label, value, trend, icon: Icon, iconBg, highlight,
}: {
  label: string
  value: string | number
  trend?: number
  icon: React.ElementType
  iconBg: string
  highlight?: boolean
}) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm ${highlight ? 'border-t-4 border-gold-500' : 'border border-gray-100'}`}>
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-gray-500 text-sm">{label}</p>
      <div className="flex items-center space-x-2 mt-1">
        <span className="text-4xl font-extrabold font-display">{value}</span>
        {trend !== undefined && trend > 0 && (
          <span className="bg-green-100 text-green-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> {trend}%
          </span>
        )}
        {trend === undefined && (
          <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">Neutral</span>
        )}
      </div>
    </div>
  )
}

// ── Status Dot ─────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-500',
    pending: 'bg-yellow-400',
    closed: 'bg-gray-300',
  }
  const labels: Record<string, string> = {
    active: 'Active',
    pending: 'Pending',
    closed: 'Closed',
  }
  return (
    <span className="flex items-center">
      <span className={`w-2 h-2 ${colors[status]} rounded-full mr-2`} />
      {labels[status]}
    </span>
  )
}

// ── Dashboard Page ─────────────────────────────────────────────────

export default function Dashboard() {
  const stats = dashboardStats
  const recentConversations = conversations.slice(0, 4)
  const todayLeads = leads.slice(0, 3)

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center text-xs text-gray-400">
          <span>Last updated: just now</span>
          <Clock className="w-4 h-4 ml-2" />
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Conversations"
          value={stats.totalConversations}
          trend={stats.conversationsTrend}
          icon={MessageSquare}
          iconBg="bg-blue-50 text-blue-500"
        />
        <StatCard
          label="Leads Captured"
          value={stats.leadsCaptures}
          trend={stats.leadsTrend}
          icon={Users}
          iconBg="bg-green-50 text-green-500"
          highlight
        />
        <StatCard
          label="Avg Response"
          value={stats.avgResponse}
          icon={Clock}
          iconBg="bg-purple-50 text-purple-500"
        />
        <StatCard
          label="KB Coverage"
          value={`${stats.kbCoverage}%`}
          icon={Database}
          iconBg="bg-orange-50 text-orange-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="col-span-2 space-y-6">
          {/* Recent Conversations Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="font-bold text-gray-800">Recent Conversations</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Visitor</th>
                  <th className="px-6 py-3 font-medium">Messages</th>
                  <th className="px-6 py-3 font-medium">Intent</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {recentConversations.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-medium">{c.visitor.name}</td>
                    <td className="px-6 py-4">{c.messageCount}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-900/10 text-blue-900 px-3 py-1 rounded-full text-xs font-medium">
                        {c.intent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusDot status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-400">{c.timeAgo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KB Health */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-bold text-gray-800 mb-6">Knowledge Base Health</h2>
            <div className="space-y-4">
              {kbHealth.map((item) => (
                <div key={item.category} className="flex items-center">
                  <div className="flex justify-between w-28">
                    <span className="text-xs font-medium text-gray-700">{item.category}</span>
                    <span className="text-xs font-semibold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full ml-4 overflow-hidden">
                    <div
                      className="bg-gold-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1/3 — Today's Leads */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-800">Today's Leads</h2>
          </div>
          <div className="space-y-6">
            {todayLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${lead.avatarColor} flex items-center justify-center font-bold text-sm`}>
                    {lead.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{lead.name}</p>
                    <p className="text-[11px] text-gray-400">{lead.route}</p>
                  </div>
                </div>
                {lead.isGold ? (
                  <div className="flex items-center space-x-1.5 bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="text-[10px] font-bold">{lead.score}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 font-bold text-sm">{lead.score}</span>
                )}
              </div>
            ))}
          </div>
          <a href="/leads" className="block text-center text-gold-500 text-sm font-bold mt-6 hover:underline">
            View all →
          </a>
        </div>
      </div>
    </div>
  )
}

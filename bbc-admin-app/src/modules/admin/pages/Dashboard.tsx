import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { StatCard } from '../../../shared/components/StatCard';
import { Badge } from '../../../shared/components/Badge';
import { Avatar } from '../../../shared/components/Avatar';
import { ScoreBadge } from '../../../shared/components/ScoreBadge';
import { useDashboard } from '../../../shared/hooks/useDashboard';
import { getConversations, getLeads, getKBCategories } from '../../../shared/store';

const Dashboard: React.FC = () => {
  const { stats } = useDashboard();
  const conversations = getConversations().slice(0, 5);
  const leads = getLeads().slice(0, 5);
  const kb = getKBCategories();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your chatbot performance</p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Conversations" value={stats.totalConversations} highlight />
        <StatCard icon={<Users className="w-5 h-5" />} label="Leads Captured" value={stats.leadsCount} />
        <StatCard icon={<Zap className="w-5 h-5" />} label="Avg Response" value={stats.avgResponse} />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="KB Coverage" value={stats.kbCoverage} />
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Active Chats" value={stats.activeConversations} />
        <StatCard icon={<Users className="w-5 h-5" />} label="Leads This Week" value={stats.leadsThisWeek} />
        <StatCard icon={<Zap className="w-5 h-5" />} label="Conversion Rate" value={stats.conversionRate} />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="Top Route" value={stats.topRoute} />
      </div>

      {/* Leads by Day Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Leads Captured (Last 7 Days)</h2>
        <div className="grid grid-cols-7 gap-2">
          {stats.leadsByDay.map((entry, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative w-full h-16 bg-gray-100 rounded-lg flex items-end justify-center mb-2">
                <div
                  className="w-3/4 bg-[var(--color-navy-900)] rounded-t transition-all"
                  style={{ height: `${(entry.count / Math.max(...stats.leadsByDay.map(e => e.count), 5)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{entry.day}</span>
              <span className="text-xs text-gray-400">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tunnel Split */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-900 font-display mb-4">Conversation Tunnel Split</h2>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">Sales</span>
              <span className="text-sm font-semibold text-gray-900">{stats.tunnelSplit.sales}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-[var(--color-gold-500)] transition-all"
                style={{ width: `${stats.tunnelSplit.sales + stats.tunnelSplit.support > 0 ? (stats.tunnelSplit.sales / (stats.tunnelSplit.sales + stats.tunnelSplit.support)) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">Support</span>
              <span className="text-sm font-semibold text-gray-900">{stats.tunnelSplit.support}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${stats.tunnelSplit.sales + stats.tunnelSplit.support > 0 ? (stats.tunnelSplit.support / (stats.tunnelSplit.sales + stats.tunnelSplit.support)) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 font-display">Recent Conversations</h2>
            <button
              onClick={() => navigate('/conversations')}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => navigate(`/conversations/${conv.id}`)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={conv.visitorName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{conv.visitorName}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.intent}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge label={conv.status} variant="status" />
                  <span className="text-xs text-gray-400">{conv.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 font-display">Recent Leads</h2>
            <button
              onClick={() => navigate('/leads')}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {leads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={lead.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.route}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge label={lead.intent} variant="intent" />
                  <ScoreBadge score={lead.score} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 font-display">Knowledge Base Coverage</h2>
          <button
            onClick={() => navigate('/knowledge-base')}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            Manage <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {kb.map(cat => {
            const pct = Math.min(100, Math.round((cat.entries.length / 5) * 100));
            return (
              <div key={cat.id} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-32 truncate">{cat.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-navy-800)] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{cat.entries.length} entries</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { StatCard } from '../../../shared/components/StatCard';
import { Badge } from '../../../shared/components/Badge';
import { getDashboardStats, getConversations, getLeads, getKBCategories } from '../../../shared/store';

const Dashboard: React.FC = () => {
  const stats = getDashboardStats();
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Conversations" value={stats.totalConversations} highlight />
        <StatCard icon={<Users className="w-5 h-5" />} label="Leads Captured" value={stats.leadsCount} />
        <StatCard icon={<Zap className="w-5 h-5" />} label="Avg Response" value={stats.avgResponse} />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label="KB Coverage" value={stats.kbCoverage} />
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
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {conv.visitorName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${lead.avatarColor}`}>
                    {lead.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.route}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge label={lead.intent} variant="intent" />
                  <Badge label={String(lead.score)} variant="score" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KB Coverage */}
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

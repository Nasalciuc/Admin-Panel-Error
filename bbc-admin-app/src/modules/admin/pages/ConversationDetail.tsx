import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Bot, Headphones, CheckCircle2 } from 'lucide-react';
import { useConversations } from '../../../shared/hooks/useConversations';
import { Badge } from '../../../shared/components/Badge';
import { Avatar } from '../../../shared/components/Avatar';
import { ScoreBadge } from '../../../shared/components/ScoreBadge';
import { RouteCardDisplay } from '../../../shared/components/RouteCardDisplay';
import { getLeads } from '../../../shared/store';

const ROLE_CONFIG = {
  visitor: { icon: User, label: 'Visitor', bubbleBg: 'bg-white border border-gray-200', textColor: 'text-gray-800', align: 'justify-start', iconBg: 'bg-gray-100 text-gray-500' },
  ai: { icon: Bot, label: 'AI Assistant', bubbleBg: 'bg-white border border-gray-200', textColor: 'text-gray-800', align: 'justify-start', iconBg: 'bg-blue-100 text-blue-600' },
  agent: { icon: Headphones, label: 'Agent', bubbleBg: 'bg-[var(--color-navy-900)]', textColor: 'text-white', align: 'justify-end', iconBg: 'bg-emerald-100 text-emerald-600' },
};

const ConversationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, addMessage, close } = useConversations();
  const [replyText, setReplyText] = useState('');

  const conv = id ? conversations.find(c => c.id === id) : undefined;

  if (!conv) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">Conversation not found</p>
        <button onClick={() => navigate('/conversations')} className="text-sm text-[var(--color-navy-900)] hover:underline">
          ← Back to Conversations
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!replyText.trim() || !id) return;
    addMessage(id, {
      role: 'agent',
      content: replyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setReplyText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCloseConversation = () => {
    if (id) {
      close(id);
      navigate('/conversations');
    }
  };

  return (
    <div className="flex gap-6 max-w-7xl h-[calc(100vh-theme(spacing.12)-theme(spacing.6)*2)]">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200">
          <button onClick={() => navigate('/conversations')} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar name={conv.visitorName} size="sm" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{conv.visitorName}</p>
            <p className="text-xs text-gray-500">{conv.visitorEmail}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge label={conv.type === 'SALES' ? 'Sales' : 'Support'} variant={conv.type === 'SALES' ? 'sales' : 'support'} />
            <Badge label={conv.status} variant="status" />
            {conv.status !== 'Closed' && (
              <button
                onClick={handleCloseConversation}
                className="ml-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
          {conv.messages.map(msg => {
            const cfg = ROLE_CONFIG[msg.role];
            const RoleIcon = cfg.icon;
            return (
              <div key={msg.id} className={`flex ${cfg.align} gap-2`}>
                {msg.role !== 'agent' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="max-w-[70%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">{cfg.label}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                  <div className={`rounded-xl px-4 py-2.5 text-sm ${cfg.bubbleBg} ${cfg.textColor}`}>
                    {msg.content}
                    {msg.isLeadCapture && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-gold-500)]" />
                        <span className="text-xs font-medium text-[var(--color-gold-600)]">Lead Captured</span>
                      </div>
                    )}
                  </div>
                  {msg.routeCard && <RouteCardDisplay card={msg.routeCard} />}
                </div>
                {msg.role === 'agent' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reply Input */}
        {conv.status !== 'Closed' && (
          <div className="px-5 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply as agent..."
                rows={1}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)] resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="p-2.5 rounded-xl bg-[var(--color-navy-900)] text-white hover:bg-[var(--color-navy-800)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-72 shrink-0 space-y-4">
        {/* Linked Lead Details */}
        {(() => {
          const linkedLead = getLeads().find(l => l.email === conv.visitorEmail);
          if (linkedLead) {
            return (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 font-display">Linked Lead</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={linkedLead.name} size="md" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{linkedLead.name}</p>
                      <ScoreBadge score={linkedLead.score} />
                    </div>
                  </div>
                  <div className="space-y-2 text-xs border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Route:</span>
                      <span className="font-medium text-gray-900">{linkedLead.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Intent:</span>
                      <Badge label={linkedLead.intent} variant="intent" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <Badge label={linkedLead.status} variant="status" />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/leads')}
                    className="w-full px-3 py-2 text-sm font-medium text-[var(--color-navy-900)] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    View Lead Profile
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Conversation Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 font-display">Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500">Messages</span>
              <span className="font-medium text-gray-900">{conv.messages.length}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-gray-900">{conv.duration}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500">Type</span>
              <Badge label={conv.type === 'SALES' ? 'Sales' : 'Support'} variant={conv.type === 'SALES' ? 'sales' : 'support'} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Intent</span>
              <Badge label={conv.intent} variant="intent" />
            </div>
          </div>
          {conv.leadCaptured && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-gold-500)]/10 mt-3">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-gold-500)]" />
              <span className="text-xs font-medium text-[var(--color-gold-600)]">Lead Captured</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;

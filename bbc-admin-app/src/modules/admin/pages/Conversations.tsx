import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useConversations } from '../../../shared/hooks/useConversations';
import { Badge } from '../../../shared/components/Badge';
import { EmptyState } from '../../../shared/components/EmptyState';

const Conversations: React.FC = () => {
  const { conversations } = useConversations();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Conversations</h1>
        <p className="text-sm text-gray-500 mt-1">{conversations.length} total conversations</p>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {conversations.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-6 h-6" />}
            title="No conversations yet"
            description="Conversations will appear here when visitors start chatting."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => navigate(`/conversations/${conv.id}`)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                    {conv.visitorName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{conv.visitorName}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{conv.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{conv.visitorEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge label={conv.intent} variant="intent" />
                  <Badge label={conv.status} variant="status" />
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{conv.duration}</p>
                    <p className="text-xs text-gray-400">{conv.messages.length} msgs</p>
                  </div>
                  {conv.leadCaptured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-gold-500)]/10 text-[var(--color-gold-600)] font-medium ring-1 ring-[var(--color-gold-500)]/30">
                      Lead ✓
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;

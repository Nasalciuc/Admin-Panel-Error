import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, BookOpen, Settings } from 'lucide-react';
import { BBCLogo } from './BBCLogo';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/conversations', icon: MessageSquare, label: 'Conversations' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-[var(--color-navy-900)] flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 bg-white">
        <BBCLogo className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-l-2 border-[var(--color-gold-500)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-gray-500">BBC Admin v1.0</p>
      </div>
    </aside>
  );
};

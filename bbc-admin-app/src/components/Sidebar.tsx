import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  Settings,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-navy-900 flex flex-col text-gray-400 z-40">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Replace with: <img src={logo} alt="BBC" className="w-8 h-8 rounded-full" /> */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xs italic">B</span>
          </div>
          <div className="leading-tight">
            <p className="text-white text-xs font-bold tracking-widest">BUY BUSINESS</p>
            <p className="text-white text-xs font-bold tracking-widest">CLASS</p>
          </div>
        </div>
        <span className="bg-gold-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'hover:text-white hover:bg-navy-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gold-500 text-black rounded-full flex items-center justify-center font-bold">
          SC
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Scaler</p>
          <p className="text-xs">Admin</p>
        </div>
      </div>
    </aside>
  )
}

import {
  LayoutDashboard, ListTodo, MessageSquare, Users, UserPlus, BookOpen,
  Puzzle, Settings, UserCog, Wrench, Palette, Bell, Monitor,
  ShieldCheck, Bug, Lock, UserX, FileX, ServerOff, Construction, Plane,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Scaler',
    email: 'scaler@buybusinessclass.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    { name: 'BuyBusinessClass', logo: Plane, plan: 'Admin Panel' },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        { title: 'Dashboard', url: '/', icon: LayoutDashboard },
        { title: 'Conversations', url: '/chats', badge: '3', icon: MessageSquare },
        { title: 'Tasks', url: '/tasks', icon: ListTodo },
        { title: 'Leads', url: '/leads', icon: UserPlus },
      ],
    },
    {
      title: 'Management',
      items: [
        { title: 'Users', url: '/users', icon: Users },
        { title: 'Knowledge Base', url: '/knowledge-base', icon: BookOpen },
      ],
    },
    {
      title: 'System',
      items: [
        { title: 'Integrations', url: '/apps', icon: Puzzle },
        {
          title: 'Settings', icon: Settings,
          items: [
            { title: 'Profile', url: '/settings', icon: UserCog },
            { title: 'Account', url: '/settings/account', icon: Wrench },
            { title: 'Appearance', url: '/settings/appearance', icon: Palette },
            { title: 'Notifications', url: '/settings/notifications', icon: Bell },
            { title: 'Display', url: '/settings/display', icon: Monitor },
          ],
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth', icon: ShieldCheck,
          items: [
            { title: 'Sign In', url: '/sign-in' },
            { title: 'Sign Up', url: '/sign-up' },
            { title: 'Forgot Password', url: '/forgot-password' },
          ],
        },
        {
          title: 'Errors', icon: Bug,
          items: [
            { title: 'Unauthorized', url: '/errors/unauthorized', icon: Lock },
            { title: 'Forbidden', url: '/errors/forbidden', icon: UserX },
            { title: 'Not Found', url: '/errors/not-found', icon: FileX },
            { title: 'Server Error', url: '/errors/internal-server-error', icon: ServerOff },
            { title: 'Maintenance', url: '/errors/maintenance-error', icon: Construction },
          ],
        },
      ],
    },
  ],
}

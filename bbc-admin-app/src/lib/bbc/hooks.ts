// ── BBC RBAC Hooks ───────────────────────────────────────────────
// V1: mock auth with role switcher. V2: swap to Supabase Auth.

import { useState, useCallback, useMemo } from 'react'
import type { UserRole, Permissions } from './types'
import { MOCK_USERS } from './store'

function getPermissions(role: UserRole): Permissions {
  switch (role) {
    case 'owner':
    case 'admin':
      return {
        canViewLeads: true, canEditLeads: true, canViewAllConversations: true,
        canViewUsers: true, canEditUsers: true, canEditKB: true, canViewKB: true,
        canProposeKBChanges: true, canViewIntegrations: true, canEditSettings: true,
        canViewAllSettings: true, canViewDashboardGlobal: true, canAssignTasks: true,
        visibleTunnels: ['all'],
      }
    case 'sales':
      return {
        canViewLeads: true, canEditLeads: false, canViewAllConversations: false,
        canViewUsers: false, canEditUsers: false, canEditKB: false, canViewKB: true,
        canProposeKBChanges: true, canViewIntegrations: false, canEditSettings: false,
        canViewAllSettings: false, canViewDashboardGlobal: false, canAssignTasks: false,
        visibleTunnels: ['sales'],
      }
    case 'support':
      return {
        canViewLeads: false, canEditLeads: false, canViewAllConversations: false,
        canViewUsers: false, canEditUsers: false, canEditKB: false, canViewKB: true,
        canProposeKBChanges: true, canViewIntegrations: false, canEditSettings: false,
        canViewAllSettings: false, canViewDashboardGlobal: false, canAssignTasks: false,
        visibleTunnels: ['support'],
      }
  }
}

export function useAuth() {
  const [currentUserId, setCurrentUserId] = useState<string>('user_admin')
  const user = useMemo(() => MOCK_USERS.find(u => u.id === currentUserId) || MOCK_USERS[0], [currentUserId])
  const switchUser = useCallback((userId: string) => setCurrentUserId(userId), [])
  const switchRole = useCallback((role: UserRole) => {
    const target = MOCK_USERS.find(u => u.role === role)
    if (target) setCurrentUserId(target.id)
  }, [])
  return { user, switchUser, switchRole, allUsers: MOCK_USERS }
}

export function usePermissions(role: UserRole): Permissions {
  return useMemo(() => getPermissions(role), [role])
}

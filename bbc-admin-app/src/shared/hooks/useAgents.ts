import { useState, useCallback } from 'react';
import type { Agent } from '../types';
import { getAgents, getOnlineAgents, updateAgentStatus } from '../store';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(getAgents);

  const refresh = useCallback(() => setAgents(getAgents()), []);

  const online = useCallback((tunnel?: string) => getOnlineAgents(tunnel), []);

  const updateStatus = useCallback((id: string, status: Agent['status']) => {
    const result = updateAgentStatus(id, status);
    refresh();
    return result;
  }, [refresh]);

  return { agents, online, updateStatus, refresh };
}

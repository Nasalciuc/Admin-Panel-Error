import { useState, useCallback } from 'react';
import type { Lead } from '../types';
import { getLeads, addLead, updateLead, deleteLead, filterLeads } from '../store';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(getLeads);

  const refresh = useCallback(() => setLeads(getLeads()), []);

  const add = useCallback((data: Omit<Lead, 'id' | 'initials' | 'avatarColor' | 'capturedAt'>) => {
    const lead = addLead(data);
    refresh();
    return lead;
  }, [refresh]);

  const update = useCallback((id: string, updates: Partial<Lead>) => {
    const result = updateLead(id, updates);
    refresh();
    return result;
  }, [refresh]);

  const remove = useCallback((id: string) => {
    const result = deleteLead(id);
    refresh();
    return result;
  }, [refresh]);

  const filter = useCallback((opts: { search?: string; intent?: string; status?: string }) => {
    setLeads(filterLeads(opts));
  }, []);

  return { leads, add, update, remove, filter, refresh };
}

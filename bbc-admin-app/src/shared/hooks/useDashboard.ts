import { useState, useCallback } from 'react';
import type { DashboardStats } from '../types';
import { getDashboardStats } from '../store';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>(getDashboardStats);

  const refresh = useCallback(() => setStats(getDashboardStats()), []);

  return { stats, refresh };
}

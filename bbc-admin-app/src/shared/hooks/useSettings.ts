import { useState, useCallback } from 'react';
import type { AppSettings } from '../types';
import { getSettings, updateSettings } from '../store';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  const refresh = useCallback(() => setSettings(getSettings()), []);

  const update = useCallback((updates: Partial<AppSettings>) => {
    const next = updateSettings(updates);
    setSettings(next);
    return next;
  }, []);

  return { settings, update, refresh };
}

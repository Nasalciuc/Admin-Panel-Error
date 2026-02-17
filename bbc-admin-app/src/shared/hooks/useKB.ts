import { useState, useCallback } from 'react';
import type { KBCategory } from '../types';
import { getKBCategories, addKBEntry, updateKBEntry, deleteKBEntry } from '../store';

export function useKB() {
  const [categories, setCategories] = useState<KBCategory[]>(getKBCategories);

  const refresh = useCallback(() => setCategories(getKBCategories()), []);

  const addEntry = useCallback((categoryId: string, title: string, content: string) => {
    const result = addKBEntry(categoryId, title, content);
    refresh();
    return result;
  }, [refresh]);

  const updateEntry = useCallback((categoryId: string, entryId: string, updates: { title?: string; content?: string }) => {
    const result = updateKBEntry(categoryId, entryId, updates);
    refresh();
    return result;
  }, [refresh]);

  const removeEntry = useCallback((categoryId: string, entryId: string) => {
    const result = deleteKBEntry(categoryId, entryId);
    refresh();
    return result;
  }, [refresh]);

  return { categories, addEntry, updateEntry, removeEntry, refresh };
}

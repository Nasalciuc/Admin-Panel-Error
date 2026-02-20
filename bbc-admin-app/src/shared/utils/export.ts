/**
 * CSV export utilities for Leads.
 */
import type { Lead } from '../types';
import { formatDate } from './formatters';

export function leadsToCSV(leads: Lead[]): string {
  const headers = ['Name', 'Email', 'Phone', 'Route', 'Intent', 'Score', 'Status', 'Source', 'Tags', 'Captured'];
  const rows = leads.map(l => [
    l.name,
    l.email,
    l.phone || '',
    l.route,
    l.intent,
    l.score.toString(),
    l.status,
    l.leadSource || 'manual',
    (l.tags || []).join('; '),
    formatDate(l.capturedAt),
  ]);
  
  const escape = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  return [headers.join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

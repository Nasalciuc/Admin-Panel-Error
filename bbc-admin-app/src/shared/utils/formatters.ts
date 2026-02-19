/**
 * Date/time/phone/score formatting utilities.
 * Pure functions, no side effects.
 */

/** "Feb 19, 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

/** "2:30 PM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

/** "5 min ago" | "2h ago" | "Yesterday" | "Feb 19" */
export function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(iso);
}

/** "+1 (555) 012-3456" or "—" if empty */
export function formatPhone(phone: string): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  }
  return phone; // return as-is if can't format
}

/** Score → { label, emoji, color } */
export function formatScore(score: number): { label: string; emoji: string; bgColor: string; textColor: string } {
  if (score >= 80) return { label: 'Gold', emoji: '🥇', bgColor: 'bg-amber-50', textColor: 'text-amber-700' };
  if (score >= 50) return { label: 'Silver', emoji: '🥈', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
  return { label: 'Bronze', emoji: '🥉', bgColor: 'bg-orange-50', textColor: 'text-orange-600' };
}

/** Duration between two ISO dates → "5m 23s" */
export function formatDuration(startIso: string, endIso?: string): string {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const diffSec = Math.floor((end - start) / 1000);
  const min = Math.floor(diffSec / 60);
  const sec = diffSec % 60;
  return `${min}m ${sec}s`;
}

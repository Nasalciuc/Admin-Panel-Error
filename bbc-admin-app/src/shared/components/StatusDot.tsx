/**
 * Tiny colored dot + label for status display.
 *
 * Usage: <StatusDot status="Active" />
 */
import React from 'react';

const DEFAULT_COLORS: Record<string, string> = {
  Active: 'text-emerald-500',
  Pending: 'text-amber-500',
  Closed: 'text-gray-400',
  New: 'text-blue-500',
  Contacted: 'text-amber-500',
  Converted: 'text-emerald-500',
  Qualified: 'text-emerald-500',
  Lost: 'text-red-500',
  online: 'text-emerald-500',
  offline: 'text-gray-400',
  busy: 'text-amber-500',
};

interface Props {
  status: string;
  colorMap?: Record<string, string>;
}

export const StatusDot: React.FC<Props> = ({ status, colorMap }) => {
  const colors = { ...DEFAULT_COLORS, ...colorMap };
  const dotColor = colors[status] || 'text-gray-400';

  return (
    <span className={`flex items-center gap-1.5 text-sm ${dotColor}`}>
      <span className="text-[8px]">●</span>
      <span className="text-gray-700">{status}</span>
    </span>
  );
};

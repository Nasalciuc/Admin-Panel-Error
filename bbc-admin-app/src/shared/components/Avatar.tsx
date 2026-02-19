/**
 * Reusable avatar with initials.
 * Replaces inline avatar code duplicated in Dashboard, Leads, Conversations.
 *
 * Usage: <Avatar name="John Thompson" size="md" />
 */
import React from 'react';

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
];

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string; // override auto color
}

export const Avatar: React.FC<Props> = ({ name, size = 'md', color }) => {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  // Deterministic color from name (not random, so same name = same color)
  const autoColor = COLORS[name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length];

  return (
    <div className={`${SIZES[size]} ${color || autoColor} rounded-full flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </div>
  );
};

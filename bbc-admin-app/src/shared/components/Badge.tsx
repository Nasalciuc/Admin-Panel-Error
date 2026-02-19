import React from 'react';

type Variant = 'intent' | 'status' | 'score' | 'gold' | 'emerald' | 'sales' | 'support';

interface BadgeProps {
  label: string;
  variant: Variant;
  className?: string;
}

const intentColors: Record<string, string> = {
  'Flight Booking': 'bg-blue-50 text-blue-700',
  'Price Inquiry': 'bg-emerald-50 text-emerald-700',
  'Route Information': 'bg-amber-50 text-amber-700',
  'Support': 'bg-purple-50 text-purple-700',
  'New Inquiry': 'bg-cyan-50 text-cyan-700',
  'Support Request': 'bg-rose-50 text-rose-700',
};

const statusColors: Record<string, string> = {
  // Lead statuses
  New: 'bg-blue-50 text-blue-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Converted: 'bg-emerald-50 text-emerald-700',
  Lost: 'bg-red-50 text-red-600',
  // Conversation statuses
  Active: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Closed: 'bg-gray-100 text-gray-600',
};

const variantStyles: Record<string, string> = {
  gold: 'bg-amber-50 text-amber-700 border border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  sales: 'bg-amber-50 text-amber-700 border border-amber-200',
  support: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export const Badge: React.FC<BadgeProps> = ({ label, variant, className = '' }) => {
  if (variant === 'gold' || variant === 'emerald' || variant === 'sales' || variant === 'support') {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
        {label}
      </span>
    );
  }

  if (variant === 'score') {
    const num = parseInt(label, 10);
    const isHigh = num >= 80;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
        isHigh ? 'bg-[var(--color-gold-500)]/10 text-[var(--color-gold-600)] ring-1 ring-[var(--color-gold-500)]/30' : 'bg-gray-100 text-gray-700'
      } ${className}`}>
        {label}
      </span>
    );
  }

  const colorMap = variant === 'intent' ? intentColors : statusColors;
  const colors = colorMap[label] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors} ${className}`}>
      {label}
    </span>
  );
};

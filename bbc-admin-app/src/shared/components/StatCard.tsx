import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, highlight = false }) => {
  return (
    <div className={`rounded-xl p-5 shadow-sm ${
      highlight
        ? 'bg-[var(--color-navy-900)] text-white'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          highlight
            ? 'bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)]'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${highlight ? 'text-gray-300' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      <p className={`text-4xl font-extrabold font-display ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
};

/**
 * Reusable search input with icon and 300ms debounce.
 * Replaces duplicated search inputs in Leads.tsx and Conversations.tsx.
 *
 * Usage: <SearchInput value={search} onChange={setSearch} placeholder="Search leads..." />
 */
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => onChange(internal), 300);
    return () => clearTimeout(timer);
  }, [internal, onChange]);

  // Sync external changes
  useEffect(() => {
    setInternal(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={internal}
        onChange={e => setInternal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20 focus:border-[var(--color-navy-900)] transition-colors"
      />
    </div>
  );
};

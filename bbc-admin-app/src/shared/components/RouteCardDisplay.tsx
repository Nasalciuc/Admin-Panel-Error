/**
 * Route card display for conversation detail.
 * Shows airline, duration, price range in a styled card.
 * Used in ConversationDetail.tsx when a message has routeCard field.
 *
 * Usage: <RouteCardDisplay card={message.routeCard} />
 */
import React from 'react';
import { Plane, Clock, AlertCircle } from 'lucide-react';
import type { RouteCard } from '../types';

interface Props {
  card: RouteCard;
}

export const RouteCardDisplay: React.FC<Props> = ({ card }) => {
  return (
    <div className="bg-gradient-to-br from-[var(--color-navy-900)] to-[#132744] text-white rounded-xl p-4 max-w-sm mt-2">
      {/* Route header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold font-display">{card.originCode}</span>
          <Plane className="w-4 h-4 text-[var(--color-gold-500)]" />
          <span className="text-lg font-bold font-display">{card.destinationCode}</span>
        </div>
        {card.isNonStop && (
          <span className="text-[10px] font-medium bg-white/10 px-2 py-0.5 rounded-full">Nonstop</span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>~{card.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Plane className="w-3.5 h-3.5" />
          <span>{card.airlines.join(' · ')}</span>
        </div>
        {card.dates && (
          <div className="text-xs text-gray-400">{card.dates}</div>
        )}
      </div>

      {/* Price */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-[var(--color-gold-500)] font-bold font-display text-lg">
          {card.priceRange}
        </div>
        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
          <AlertCircle className="w-3 h-3" />
          <span>Prices are estimates, subject to availability</span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full mt-3 py-2 bg-[var(--color-gold-500)] hover:bg-[var(--color-gold-500)]/90 text-[var(--color-navy-900)] text-sm font-semibold rounded-lg transition-colors">
        Get Exact Quote
      </button>
    </div>
  );
};

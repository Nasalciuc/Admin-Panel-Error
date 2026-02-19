/**
 * Lead score display with medal emoji.
 *
 * Usage: <ScoreBadge score={92} />
 * Renders: 🥇 92 with gold background
 */
import React from 'react';
import { formatScore } from '../utils/formatters';

interface Props {
  score: number;
  showLabel?: boolean; // show "Gold" / "Silver" / "Bronze" text
}

export const ScoreBadge: React.FC<Props> = ({ score, showLabel = false }) => {
  const { label, emoji, bgColor, textColor } = formatScore(score);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      <span>{emoji}</span>
      <span>{score}</span>
      {showLabel && <span className="ml-0.5 font-normal">{label}</span>}
    </span>
  );
};

import React from 'react';

export const BBCLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Plane icon */}
    <g transform="translate(2,6)">
      <path d="M24 14L18 11L4 14L6 12L2 10L6 8L18 11L14 4L16 4L24 14Z"
        fill="var(--color-gold-500, #C9A54E)" />
    </g>
    {/* BBC text */}
    <text x="34" y="18" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="white">
      BBC
    </text>
    {/* Tagline */}
    <text x="34" y="32" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="8" fill="rgba(255,255,255,0.5)">
      Buy Business Class
    </text>
  </svg>
);

import React from 'react';

export const BBCLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <img src="/Logo.png" alt="Buy Business Class" className={className} />
);

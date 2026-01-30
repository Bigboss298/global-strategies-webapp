import React from 'react';

// Badge color mapping (per user spec)
const BADGE_COLOR_MAP: Record<number, string> = {
  0: '#9CA3AF',      // None: gray-400
  1: '#2563EB',      // Verified: blue-600
  2: '#16A34A',      // Expert: green-600
  3: '#F59E0B',      // Premium: amber-500
  4: '#6D28D9',      // Corporate: violet-700 (modern)
};

const BADGE_LABEL_MAP: Record<number, string> = {
  0: 'None',
  1: 'Verified',
  2: 'Expert',
  3: 'Premium',
  4: 'Corporate',
};

interface StrategistBadgeProps {
  badgeType?: number;
  showLabel?: boolean;
  className?: string;
  withDot?: boolean; // new prop to control dot rendering
}

export const StrategistBadge: React.FC<StrategistBadgeProps> = ({ badgeType = 0, showLabel = false, className = '', withDot = true }) => {
  if (!badgeType) return null;
  const color = BADGE_COLOR_MAP[badgeType] || BADGE_COLOR_MAP[0];
  const label = BADGE_LABEL_MAP[badgeType] || BADGE_LABEL_MAP[0];
  return (
    <span className={`inline-flex items-center ${className}`} title={label}>
      {withDot && (
        <span className="mr-2 text-xl text-gray-900 select-none" style={{lineHeight: 1}}>&#8226;</span>
      )}
      <span
        className="w-5 h-5 flex items-center justify-center rounded-md font-bold text-xs text-white select-none mr-1"
        style={{ background: color }}
      >
        S
      </span>
      {showLabel && (
        <span className="ml-1 text-xs font-medium text-gray-700 align-middle">{label}</span>
      )}
    </span>
  );
};

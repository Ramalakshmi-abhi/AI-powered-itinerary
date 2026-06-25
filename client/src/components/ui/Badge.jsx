import React from 'react';

const variantMap = {
  primary: { bg: 'rgba(99,102,241,0.15)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)' },
  success: { bg: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)' },
  error: { bg: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' },
  info: { bg: 'rgba(6,182,212,0.15)', color: '#22D3EE', border: '1px solid rgba(6,182,212,0.3)' },
  violet: { bg: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' },
  draft: { bg: 'rgba(107,114,128,0.15)', color: 'var(--text-secondary)', border: '1px solid rgba(107,114,128,0.3)' },
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
  style: extraStyle = {},
}) => {
  const v = variantMap[variant] || variantMap.primary;
  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '4px 10px';
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '0.875rem' : '0.75rem';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding,
        fontSize,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        background: v.bg,
        color: v.color,
        border: v.border,
        borderRadius: '9999px',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: v.color,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;

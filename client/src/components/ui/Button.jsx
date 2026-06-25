import React from 'react';
import { motion } from 'framer-motion';

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
  },
  secondary: {
    background: 'var(--glass-bg)',
    color: 'var(--text-primary)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'rgba(239,68,68,0.12)',
    color: '#EF4444',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  success: {
    background: 'rgba(16,185,129,0.12)',
    color: '#10B981',
    border: '1px solid rgba(16,185,129,0.3)',
  },
  outline: {
    background: 'transparent',
    color: '#6366F1',
    border: '1px solid #6366F1',
  },
};

const sizeStyles = {
  sm: { padding: '6px 14px', fontSize: '0.8125rem', borderRadius: '8px', height: '32px' },
  md: { padding: '10px 20px', fontSize: '0.9375rem', borderRadius: '10px', height: '42px' },
  lg: { padding: '14px 28px', fontSize: '1rem', borderRadius: '12px', height: '52px' },
};

const Spinner = ({ size }) => (
  <svg
    width={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
    height={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{ animation: 'spin 0.8s linear infinite' }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
);

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon = null,
  className = '',
  style: extraStyle = {},
}) => {
  const base = variantStyles[variant] || variantStyles.primary;
  const sz = sizeStyles[size] || sizeStyles.md;

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={className}
      style={{
        ...base,
        ...sz,
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.55 : 1,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant === 'secondary') {
          e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }
        if (!isDisabled && variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'var(--glass-bg)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'secondary') {
          e.currentTarget.style.background = 'var(--glass-bg)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }
        if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {isLoading ? (
        <Spinner size={size} />
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;

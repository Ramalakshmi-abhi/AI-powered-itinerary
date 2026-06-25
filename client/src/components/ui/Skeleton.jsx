import React from 'react';

const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--bg-surface2) 25%, var(--bg-surface3) 50%, var(--bg-surface2) 75%)',
  backgroundSize: '1000px 100%',
  animation: 'shimmer 2s infinite linear',
  borderRadius: '8px',
};

const Skeleton = ({ variant = 'text', width, height, className = '', count = 1 }) => {
  const getStyle = () => {
    switch (variant) {
      case 'avatar':
        return { ...shimmerStyle, width: width || 40, height: height || 40, borderRadius: '50%' };
      case 'card':
        return { ...shimmerStyle, width: width || '100%', height: height || 180, borderRadius: '16px' };
      case 'rectangular':
        return { ...shimmerStyle, width: width || '100%', height: height || 120, borderRadius: '8px' };
      case 'text':
      default:
        return { ...shimmerStyle, width: width || '100%', height: height || 16, borderRadius: '6px' };
    }
  };

  const style = getStyle();

  if (count === 1) {
    return (
      <div
        className={className}
        style={style}
        aria-busy="true"
        aria-label="Loading..."
      />
    );
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            ...style,
            width: i === count - 1 ? '60%' : width || '100%',
          }}
          aria-busy="true"
        />
      ))}
    </div>
  );
};

// Preset Skeletons
export const CardSkeleton = ({ count = 1 }) => (
  <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Skeleton variant="rectangular" height={120} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Skeleton variant="text" width={60} height={24} style={{ borderRadius: 20 }} />
          <Skeleton variant="text" width={80} height={24} style={{ borderRadius: 20 }} />
        </div>
      </div>
    ))}
  </div>
);

export const StatSkeleton = () => (
  <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(4, 1fr)' }}>
    {[1,2,3,4].map(i => (
      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="avatar" width={36} height={36} />
        </div>
        <Skeleton variant="text" width="40%" height={32} />
      </div>
    ))}
  </div>
);

export default Skeleton;

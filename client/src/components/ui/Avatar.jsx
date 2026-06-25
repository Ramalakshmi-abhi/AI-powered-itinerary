import React, { useState } from 'react';

const Avatar = ({
  src,
  name = '',
  size = 40,
  className = '',
  style: extraStyle = {},
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const gradients = [
    'linear-gradient(135deg, #6366F1, #8B5CF6)',
    'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    'linear-gradient(135deg, #06B6D4, #10B981)',
    'linear-gradient(135deg, #F59E0B, #EF4444)',
    'linear-gradient(135deg, #10B981, #06B6D4)',
  ];

  const getGradient = (n) => {
    const index = n ? n.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  const showImage = src && !imgError;
  const initials = getInitials(name);
  const fontSize = size < 36 ? size * 0.38 : size * 0.35;

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        background: showImage ? 'transparent' : getGradient(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(255,255,255,0.12)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        ...extraStyle,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: `${fontSize}px`,
            color: '#fff',
            userSelect: 'none',
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;

import React from 'react';
import { motion } from 'framer-motion';

const UploadProgress = ({ fileName, progress = 0 }) => {
  const isComplete = progress >= 100;

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            marginRight: 12,
          }}
        >
          {fileName}
        </span>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: isComplete ? '#10B981' : '#818CF8',
            flexShrink: 0,
          }}
        >
          {isComplete ? '✓ Done' : `${progress}%`}
        </span>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          height: 5,
          background: 'var(--border-color)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: 99,
            background: isComplete
              ? 'linear-gradient(90deg, #10B981, #34D399)'
              : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            boxShadow: isComplete
              ? '0 0 10px rgba(16,185,129,0.4)'
              : '0 0 10px rgba(99,102,241,0.4)',
          }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;

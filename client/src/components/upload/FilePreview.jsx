import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFile,
  FiImage,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import Badge from '../ui/Badge';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const statusConfig = {
  pending: { variant: 'draft', icon: <FiClock size={11} />, label: 'Pending' },
  processing: { variant: 'warning', icon: <FiLoader size={11} />, label: 'Processing' },
  completed: { variant: 'success', icon: <FiCheck size={11} />, label: 'Extracted' },
  failed: { variant: 'error', icon: <FiAlertCircle size={11} />, label: 'Failed' },
};

const FilePreview = ({ file, onRemove, status = 'pending', extractedText = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const isImage = file.type?.startsWith('image/') || file.name?.match(/\.(png|jpg|jpeg)$/i);
  const isPDF = file.type === 'application/pdf' || file.name?.endsWith('.pdf');
  const s = statusConfig[status] || statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Main Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
        }}
      >
        {/* File icon / thumbnail */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: isImage
              ? 'rgba(6,182,212,0.12)'
              : 'rgba(99,102,241,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}
        >
          {isImage && file instanceof File ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : isImage ? (
            <FiImage size={20} color="#22D3EE" />
          ) : (
            <FiFile size={20} color="#818CF8" />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {formatSize(file.size || 0)} · {isPDF ? 'PDF Document' : 'Image'}
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={s.variant} size="sm">
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {s.icon} {s.label}
          </span>
        </Badge>

        {/* Expand extracted text */}
        {extractedText && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '5px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.75rem',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
            {expanded ? 'Hide' : 'Preview'}
          </motion.button>
        )}

        {/* Remove button */}
        {onRemove && (
          <motion.button
            whileHover={{ scale: 1.1, background: 'rgba(239,68,68,0.15)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              color: '#EF4444',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
          >
            <FiX size={15} />
          </motion.button>
        )}
      </div>

      {/* Extracted text collapse */}
      <AnimatePresence>
        {expanded && extractedText && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                EXTRACTED TEXT PREVIEW
              </p>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', monospace",
                  whiteSpace: 'pre-wrap',
                  maxHeight: 120,
                  overflowY: 'auto',
                }}
              >
                {extractedText.slice(0, 500)}
                {extractedText.length > 500 ? '...' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilePreview;

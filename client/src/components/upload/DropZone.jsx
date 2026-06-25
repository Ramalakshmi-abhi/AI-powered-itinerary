import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiImage, FiAlertCircle } from 'react-icons/fi';

const MAX_FILES = 10;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const DropZone = ({ onFilesAccepted, disabled = false }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles, rejectedFiles);
      }
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
      },
      maxFiles: MAX_FILES,
      maxSize: MAX_SIZE,
      disabled,
    });

  const getBorderColor = () => {
    if (isDragReject) return '#EF4444';
    if (isDragActive) return '#6366F1';
    return 'rgba(99,102,241,0.3)';
  };

  const getBgColor = () => {
    if (isDragReject) return 'rgba(239,68,68,0.06)';
    if (isDragActive) return 'rgba(99,102,241,0.1)';
    return 'rgba(99,102,241,0.04)';
  };

  return (
    <div>
      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: getBorderColor(),
          background: getBgColor(),
          scale: isDragActive ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          border: `2px dashed ${getBorderColor()}`,
          borderRadius: 20,
          padding: '48px 32px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s',
          position: 'relative',
          overflow: 'hidden',
          background: getBgColor(),
        }}
      >
        <input {...getInputProps()} />

        {/* Animated background glow */}
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={{
            y: isDragActive ? -8 : 0,
            scale: isDragActive ? 1.15 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isDragReject
              ? 'rgba(239,68,68,0.15)'
              : 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          {isDragReject ? (
            <FiAlertCircle size={32} color="#EF4444" />
          ) : (
            <FiUploadCloud size={32} color={isDragActive ? '#818CF8' : '#6366F1'} />
          )}
        </motion.div>

        {/* Text */}
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 700,
            color: isDragReject ? '#EF4444' : isDragActive ? '#818CF8' : 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {isDragReject
            ? 'Invalid file type or too large'
            : isDragActive
            ? 'Release to upload'
            : 'Drop your travel documents here'}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
          or <span style={{ color: '#818CF8', fontWeight: 600 }}>click to browse</span> your files
        </p>

        {/* Accepted formats */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: <FiFile size={12} />, label: 'PDF' },
            { icon: <FiImage size={12} />, label: 'PNG' },
            { icon: <FiImage size={12} />, label: 'JPG / JPEG' },
          ].map((f) => (
            <span
              key={f.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', marginTop: 12 }}>
          Max {MAX_FILES} files · Up to 10MB each
        </p>
      </motion.div>

      {/* Rejection messages */}
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: 12 }}
          >
            {fileRejections.map(({ file, errors }) => (
              <div
                key={file.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  marginBottom: 6,
                  color: '#F87171',
                  fontSize: '0.82rem',
                }}
              >
                <FiAlertCircle size={14} />
                <strong>{file.name}</strong>: {errors.map((e) => e.message).join(', ')}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropZone;

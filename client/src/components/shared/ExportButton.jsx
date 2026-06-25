import React from 'react';
import { motion } from 'framer-motion';
import { FiPrinter } from 'react-icons/fi';

const ExportButton = ({ label = 'Export PDF', style: extraStyle = {} }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={handlePrint}
      className="no-print"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: '0.875rem',
        transition: 'all 0.2s',
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--border-color)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
    >
      <FiPrinter size={15} />
      {label}
    </motion.button>
  );
};

export default ExportButton;

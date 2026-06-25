import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  onClick,
  padding = '24px',
  hover = true,
  style: extraStyle = {},
  gradient = false,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover && onClick ? { y: -4, scale: 1.01 } : hover ? { y: -2 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass-card ${className}`}
      style={{
        padding,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        background: gradient
          ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(6,182,212,0.04) 100%)'
          : undefined,
        ...extraStyle,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Card;

import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const PageWrapper = ({ children, style: extraStyle = {} }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        minHeight: '100vh',
        paddingTop: 64, // Navbar height
        ...extraStyle,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;

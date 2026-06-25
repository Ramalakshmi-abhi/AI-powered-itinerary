import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlane } from 'react-icons/fa';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px',
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: 480 }}>
        {/* Floating plane emoji */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [-45, -40, -50, -45],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ display: 'inline-block', marginBottom: 20 }}
        >
          <FaPlane size={80} color="#6366F1" />
        </motion.div>

        {/* 404 Header */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            margin: '0 0 16px',
          }}
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            margin: '0 0 12px',
          }}
        >
          Lost in Transit
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            margin: '0 0 32px',
          }}
        >
          The page you are looking for has departed, or the route has changed. Let's get you back on track.
        </motion.p>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Back to Home Base
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

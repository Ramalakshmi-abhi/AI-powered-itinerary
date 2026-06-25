import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { FaPlane } from 'react-icons/fa';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import Avatar from '../ui/Avatar';
import useToast from '../../hooks/useToast';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/generate', label: 'Generate' },
  { to: '/history', label: 'History' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const toast = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: 64,
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
        >
          <FaPlane size={20} color="#6366F1" style={{ transform: 'rotate(-45deg)' }} />
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Travel Planner
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  fontFamily: "'Inter', sans-serif",
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 2,
                      background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                      borderRadius: 2,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
          </motion.button>

          {/* Notification bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <FiBell size={17} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#6366F1',
                border: '1.5px solid var(--bg-primary)',
              }}
            />
          </motion.button>

          {/* Avatar Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                padding: 4,
                cursor: 'pointer',
              }}
            >
              <Avatar name={user?.fullName || user?.email} size={28} />
            </motion.button>
 
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 14,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                    minWidth: 200,
                    padding: '8px',
                    zIndex: 300,
                  }}
                >
                  <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.fullName || 'User'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{user?.email}</div>
                  </div>
                  {[
                    { icon: <FiUser size={14} />, label: 'Profile', to: '/profile' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 12px',
                        borderRadius: 8,
                        color: 'var(--text-secondary)',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 8,
                      color: '#EF4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginTop: 4,
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: 12,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <FiLogOut size={14} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen((v) => !v)}
            className="mobile-menu-btn"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 8,
              display: 'none',
              alignItems: 'center',
            }}
          >
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 190,
              background: 'var(--navbar-mobile-bg)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-color)',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  color: location.pathname === link.to ? '#818CF8' : 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  background: location.pathname === link.to ? 'rgba(99,102,241,0.12)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;

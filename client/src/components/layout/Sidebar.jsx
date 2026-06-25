import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiUpload,
  FiZap,
  FiClock,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { FaPlane } from 'react-icons/fa';
import Avatar from '../ui/Avatar';
import useToast from '../../hooks/useToast';

const navItems = [
  { to: '/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
  { to: '/upload', icon: <FiUpload size={18} />, label: 'Upload' },
  { to: '/generate', icon: <FiZap size={18} />, label: 'Generate' },
  { to: '/history', icon: <FiClock size={18} />, label: 'History' },
  { to: '/profile', icon: <FiUser size={18} />, label: 'Profile' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const width = collapsed ? 72 : 260;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width,
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 150,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 72,
          overflow: 'hidden',
        }}
      >
        <FaPlane size={22} color="#6366F1" style={{ transform: 'rotate(-45deg)', flexShrink: 0 }} />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              AI Travel Planner
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px' : '11px 14px',
                borderRadius: 12,
                textDecoration: 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.2) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                fontFamily: "'Inter', sans-serif",
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--glass-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ flexShrink: 0, color: isActive ? '#818CF8' : 'inherit' }}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User Info + Collapse */}
      <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 8px' }}>
        {/* User info card */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              marginBottom: 8,
            }}
          >
            <Avatar name={user?.fullName || user?.email} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#EF4444',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 6,
                display: 'flex',
                flexShrink: 0,
              }}
            >
              <FiLogOut size={14} />
            </button>
          </motion.div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 10,
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          {collapsed ? <FiChevronRight size={16} /> : <><span>Collapse</span><FiChevronLeft size={16} /></>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

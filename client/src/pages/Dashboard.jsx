import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  FiUpload, FiZap, FiClock, FiFile, FiShare2, FiCalendar,
  FiTrendingUp, FiArrowRight, FiRefreshCw, FiMap,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { format } from 'date-fns';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import { getDashboardStats } from '../api/itineraryApi';
import { getItineraries } from '../api/itineraryApi';
import ItineraryCard from '../components/itinerary/ItineraryCard';
import { CardSkeleton, StatSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import { deleteItinerary, shareItinerary, duplicateItinerary } from '../api/itineraryApi';

const StatCard = ({ icon, label, value, color, subtext, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: 18,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle at 100% 0%, ${color}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", margin: '6px 0 0', lineHeight: 1 }}>
          {value ?? '—'}
        </p>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
    </div>
    {subtext && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', margin: 0, fontFamily: "'Inter', sans-serif" }}>{subtext}</p>}
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    retry: 1,
  });

  const { data: itinerariesData, isLoading: itinLoading, refetch: refetchItins } = useQuery({
    queryKey: ['recentItineraries'],
    queryFn: () => getItineraries({ limit: 3, sort: '-createdAt' }),
    retry: 1,
  });

  const recentItineraries = itinerariesData?.itineraries || itinerariesData?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this itinerary?')) return;
    try {
      await deleteItinerary(id);
      toast.success('Itinerary deleted');
      refetchItins();
      refetchStats();
    } catch {
      toast.error('Failed to delete itinerary');
    }
  };

  const handleShare = async (id) => {
    try {
      const data = await shareItinerary(id);
      const code = data.shareCode || data.code;
      const url = `${window.location.origin}/share/${code}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to share itinerary');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateItinerary(id);
      toast.success('Itinerary duplicated!');
      refetchItins();
      refetchStats();
    } catch {
      toast.error('Failed to duplicate itinerary');
    }
  };

  const statCards = [
    { label: 'Total Trips', value: stats?.totalItineraries ?? 0, icon: <FaPlane size={20} />, color: '#6366F1', subtext: 'All time' },
    { label: 'Documents Uploaded', value: stats?.totalUploads ?? 0, icon: <FiFile size={20} />, color: '#06B6D4', subtext: 'Processed & ready' },
    { label: 'Shared Trips', value: stats?.sharedCount ?? 0, icon: <FiShare2 size={20} />, color: '#8B5CF6', subtext: 'Shared with others' },
    { label: 'Upcoming Trips', value: stats?.upcomingCount ?? 0, icon: <FiCalendar size={20} />, color: '#10B981', subtext: 'In the next 30 days' },
  ];

  return (
    <PageWrapper>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 1280 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 28 }}
        >
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 4 }}>
            {greeting()}, {user?.fullName?.split(' ')[0] || 'Traveler'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · Ready to plan your next adventure?
          </p>
        </motion.div>

        {/* Stats */}
        {statsLoading ? (
          <div style={{ marginBottom: 28 }}><StatSkeleton /></div>
        ) : statsError ? (
          <div style={{ marginBottom: 28, padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={{ color: '#F87171', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Could not load stats.{' '}
              <button onClick={refetchStats} style={{ color: '#818CF8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                Retry <FiRefreshCw size={12} style={{ display: 'inline' }} />
              </button>
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {statCards.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 32 }}
        >
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 14 }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              {
                icon: <FiUpload size={20} />,
                label: 'Upload Documents',
                desc: 'Add new travel files',
                to: '/upload',
                color: '#6366F1',
                gradient: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.06))',
              },
              {
                icon: <FiZap size={20} />,
                label: 'Generate Itinerary',
                desc: 'Create from your docs',
                to: '/generate',
                color: '#8B5CF6',
                gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.06))',
              },
              {
                icon: <FiClock size={20} />,
                label: 'View History',
                desc: 'All your past trips',
                to: '/history',
                color: '#06B6D4',
                gradient: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.06))',
              },
            ].map((action) => (
              <motion.div
                key={action.to}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.to)}
                style={{
                  flex: '1 1 200px',
                  maxWidth: 280,
                  padding: '18px 20px',
                  background: action.gradient,
                  border: `1px solid ${action.color}30`,
                  borderRadius: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${action.color}20`, border: `1px solid ${action.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color, flexShrink: 0 }}>
                  {action.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>{action.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>{action.desc}</div>
                </div>
                <FiArrowRight size={14} color={action.color} style={{ marginLeft: 'auto' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Itineraries */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              Recent Itineraries
            </h2>
            <Link
              to="/history"
              style={{ color: '#818CF8', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif" }}
            >
              View all <FiArrowRight size={13} />
            </Link>
          </div>

          {itinLoading ? (
            <CardSkeleton count={3} />
          ) : recentItineraries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--glass-bg)',
                border: '1px dashed var(--border-color)',
                borderRadius: 20,
              }}
            >
              <FiMap size={48} color="#6366F1" style={{ marginBottom: 16, display: 'inline-block' }} />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                No trips yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>
                Upload your first travel document to get started!
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/upload')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FiUpload size={15} /> Upload Documents
              </motion.button>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
              {recentItineraries.map((itin) => (
                <ItineraryCard
                  key={itin._id}
                  itinerary={itin}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;

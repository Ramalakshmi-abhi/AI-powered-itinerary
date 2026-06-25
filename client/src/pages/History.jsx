import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FiSearch, FiGrid, FiList, FiFilter, FiRefreshCw,
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import ItineraryCard from '../components/itinerary/ItineraryCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { getItineraries, deleteItinerary, shareItinerary, duplicateItinerary } from '../api/itineraryApi';
import useToast from '../hooks/useToast';

const STATUS_FILTERS = ['All', 'Draft', 'Generated', 'Published'];

const History = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    limit: 12,
    sort: sortBy,
    ...(search ? { search } : {}),
    ...(status !== 'All' ? { status: status.toLowerCase() } : {}),
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['itineraries', queryParams],
    queryFn: () => getItineraries(queryParams),
    keepPreviousData: true,
    retry: 1,
  });

  const itineraries = data?.itineraries || data?.data || [];
  const total = data?.total || itineraries.length;
  const totalPages = Math.ceil(total / 12);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this itinerary?')) return;
    try {
      await deleteItinerary(id);
      toast.success('Itinerary deleted');
      queryClient.invalidateQueries(['itineraries']);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleShare = async (id) => {
    try {
      const result = await shareItinerary(id);
      const code = result.shareCode || result.code;
      const url = `${window.location.origin}/share/${code}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied!');
    } catch {
      toast.error('Failed to share');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateItinerary(id);
      toast.success('Itinerary duplicated!');
      queryClient.invalidateQueries(['itineraries']);
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 1280 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 4 }}>
            Trip History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
            {total} itinerar{total !== 1 ? 'ies' : 'y'} found
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <FiSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by destination or title..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 12,
                color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#6366F1'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 14px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)',
              borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="-createdAt" style={{ background: 'var(--bg-surface2)' }}>Newest first</option>
            <option value="createdAt" style={{ background: 'var(--bg-surface2)' }}>Oldest first</option>
            <option value="-startDate" style={{ background: 'var(--bg-surface2)' }}>Trip date ↓</option>
            <option value="title" style={{ background: 'var(--bg-surface2)' }}>Title A–Z</option>
          </select>

          {/* View mode */}
          <div style={{ display: 'flex', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
            {[
              { mode: 'grid', icon: <FiGrid size={15} /> },
              { mode: 'list', icon: <FiList size={15} /> },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '9px 12px',
                  background: viewMode === mode ? 'rgba(99,102,241,0.25)' : 'transparent',
                  border: 'none',
                  color: viewMode === mode ? '#818CF8' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          <button onClick={refetch} style={{ padding: '9px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <FiRefreshCw size={15} />
          </button>
        </motion.div>

        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setStatus(s); setPage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                border: `1px solid ${status === s ? 'rgba(99,102,241,0.5)' : 'var(--border-color)'}`,
                background: status === s ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                color: status === s ? '#818CF8' : 'var(--text-secondary)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        {error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#EF4444', fontFamily: "'Inter', sans-serif" }}>Failed to load itineraries.</p>
            <Button variant="secondary" onClick={refetch} icon={<FiRefreshCw size={14} />} style={{ marginTop: 12 }}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <CardSkeleton count={6} />
        ) : itineraries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--glass-bg)', border: '1px dashed var(--border-color)', borderRadius: 20 }}
          >
            <FiSearch size={48} color="var(--text-secondary)" style={{ marginBottom: 12, display: 'inline-block' }} />
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: 16, marginBottom: 8 }}>
              No itineraries found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>
              {search || status !== 'All' ? 'Try adjusting your search or filters.' : 'Create your first itinerary to get started!'}
            </p>
            {(search || status !== 'All') && (
              <Button variant="secondary" onClick={() => { setSearch(''); setStatus('All'); }}>
                Clear filters
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: viewMode === 'grid' ? 'grid' : 'flex',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
                  flexDirection: viewMode === 'list' ? 'column' : undefined,
                  gap: 16,
                }}
              >
                {itineraries.map((itin) => (
                  <ItineraryCard
                    key={itin._id}
                    itinerary={itin}
                    viewMode={viewMode}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: '7px 12px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.875rem',
                      background: p === page ? 'rgba(99,102,241,0.2)' : 'var(--glass-bg)',
                      border: `1px solid ${p === page ? 'rgba(99,102,241,0.4)' : 'var(--border-color)'}`,
                      color: p === page ? '#818CF8' : 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default History;

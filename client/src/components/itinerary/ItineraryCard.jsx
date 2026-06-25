import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiCalendar,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiCopy,
  FiHome,
  FiClock,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { format, differenceInDays, parseISO } from 'date-fns';
import Badge from '../ui/Badge';

const statusMap = {
  draft: 'draft',
  generating: 'warning',
  generated: 'primary',
  published: 'success',
};

const ItineraryCard = ({
  itinerary,
  onDelete,
  onShare,
  onDuplicate,
  viewMode = 'grid',
}) => {
  const navigate = useNavigate();

  const {
    _id,
    title = 'Untitled Trip',
    destination = 'Unknown Destination',
    startDate,
    endDate,
    status = 'draft',
    flights = [],
    hotels = [],
    days = [],
    shareCode,
  } = itinerary || {};

  const duration = startDate && endDate
    ? differenceInDays(parseISO(endDate), parseISO(startDate))
    : days.length || 0;

  const formatDate = (date) => {
    if (!date) return '—';
    try { return format(parseISO(date), 'MMM d, yyyy'); }
    catch { return '—'; }
  };

  const gradients = [
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    'linear-gradient(135deg, #10B981 0%, #6366F1 100%)',
  ];
  const grad = gradients[(_id?.charCodeAt(0) || 0) % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 25 }}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'; }}
    >
      {/* Header gradient */}
      <div
        style={{
          background: grad,
          padding: viewMode === 'list' ? '0 20px' : '20px 20px 14px',
          minHeight: viewMode === 'list' ? 'auto' : 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minWidth: viewMode === 'list' ? 160 : 'auto',
        }}
        onClick={() => navigate(`/itinerary/${_id}`)}
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: viewMode === 'grid' ? 4 : 0 }}>
            <FiMapPin size={14} color="rgba(255,255,255,0.9)" />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 500 }}>
              {destination}
            </span>
          </div>
          {viewMode === 'grid' && (
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '1rem',
              color: '#fff',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 200,
            }}>
              {title}
            </h3>
          )}
        </div>

        {viewMode === 'grid' && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
            backdropFilter: 'blur(4px)',
            position: 'relative',
            zIndex: 1,
          }}>
            {duration}d
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: '14px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
        onClick={() => navigate(`/itinerary/${_id}`)}
      >
        {viewMode === 'list' && (
          <h3 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            {title}
          </h3>
        )}

        {/* Dates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <FiCalendar size={13} />
          <span>{formatDate(startDate)} {endDate ? `→ ${formatDate(endDate)}` : ''}</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            <FaPlane size={12} color="#818CF8" />
            <span>{flights.length} flight{flights.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            <FiHome size={12} color="#22D3EE" />
            <span>{hotels.length} hotel{hotels.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            <FiClock size={12} color="#34D399" />
            <span>{days.length} day{days.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <Badge variant={statusMap[status] || 'draft'} dot>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          gap: 4,
          background: 'rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {[
          { icon: <FiEye size={14} />, title: 'View', onClick: () => navigate(`/itinerary/${_id}`), color: '#818CF8' },
          { icon: <FiEdit2 size={14} />, title: 'Edit', onClick: () => navigate(`/itinerary/${_id}?edit=true`), color: 'var(--text-secondary)' },
          { icon: <FiShare2 size={14} />, title: 'Share', onClick: () => onShare?.(_id), color: '#22D3EE' },
          { icon: <FiCopy size={14} />, title: 'Duplicate', onClick: () => onDuplicate?.(_id), color: '#34D399' },
          { icon: <FiTrash2 size={14} />, title: 'Delete', onClick: () => onDelete?.(_id), color: '#EF4444' },
        ].map((action) => (
          <motion.button
            key={action.title}
            title={action.title}
            onClick={action.onClick}
            whileHover={{ scale: 1.12, background: 'rgba(255,255,255,0.07)' }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'transparent',
              border: 'none',
              color: action.color,
              cursor: 'pointer',
              padding: '7px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {action.icon}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ItineraryCard;

import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const FlightCard = ({ flight, index = 0 }) => {
  const {
    airline = 'Unknown Airline',
    flightNumber = '—',
    departureAirport = '???',
    arrivalAirport = '???',
    departureTime,
    arrivalTime,
    departureCity,
    arrivalCity,
    date,
    duration: flightDuration,
    class: flightClass,
  } = flight || {};

  const formatTime = (t) => {
    if (!t) return '—';
    // If it's already a time string like "14:30", use as is
    if (/^\d{2}:\d{2}/.test(t)) return t;
    try { return format(parseISO(t), 'HH:mm'); }
    catch { return t; }
  };

  const formatDate = (d) => {
    if (!d) return '';
    try { return format(parseISO(d), 'EEE, MMM d'); }
    catch { return d; }
  };

  const colors = [
    { from: '#6366F1', to: '#8B5CF6' },
    { from: '#8B5CF6', to: '#06B6D4' },
    { from: '#06B6D4', to: '#10B981' },
    { from: '#F59E0B', to: '#6366F1' },
  ];
  const c = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18,
        overflow: 'hidden',
        minWidth: 280,
        maxWidth: 320,
        flexShrink: 0,
      }}
    >
      {/* Gradient accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.from}, ${c.to})` }} />

      <div style={{ padding: '16px 18px' }}>
        {/* Airline row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {airline}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
              Flight {flightNumber}
            </div>
          </div>
          <div
            style={{
              background: `linear-gradient(135deg, ${c.from}22, ${c.to}22)`,
              border: `1px solid ${c.from}44`,
              borderRadius: 10,
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: c.from,
            }}
          >
            {flightClass || 'Economy'}
          </div>
        </div>

        {/* Departure → Arrival */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Departure */}
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)', lineHeight: 1 }}>
              {departureAirport}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{departureCity || ''}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#818CF8', marginTop: 4 }}>
              {formatTime(departureTime)}
            </div>
          </div>

          {/* Center arrow with plane */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ height: 1, width: 30, background: 'rgba(255,255,255,0.2)' }} />
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ fontSize: 16 }}
              >
                ✈️
              </motion.span>
              <div style={{ height: 1, width: 30, background: 'rgba(255,255,255,0.2)' }} />
            </div>
            {flightDuration && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <FiClock size={10} /> {flightDuration}
              </span>
            )}
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'right', flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)', lineHeight: 1 }}>
              {arrivalAirport}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{arrivalCity || ''}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#818CF8', marginTop: 4 }}>
              {formatTime(arrivalTime)}
            </div>
          </div>
        </div>

        {/* Date */}
        {date && (
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              paddingTop: 10,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <FiCalendar size={12} />
            {formatDate(date)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FlightCard;

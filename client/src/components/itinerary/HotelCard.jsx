import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiHash, FiHome } from 'react-icons/fi';
import { format, parseISO, differenceInDays } from 'date-fns';

const HotelCard = ({ hotel, index = 0 }) => {
  const {
    name = 'Unknown Hotel',
    address = '',
    city = '',
    checkIn,
    checkOut,
    confirmationNumber = '',
    roomType,
    nights,
  } = hotel || {};

  const formatDate = (d) => {
    if (!d) return '—';
    try { return format(parseISO(d), 'EEE, MMM d'); }
    catch { return d; }
  };

  const stayNights = nights || (
    checkIn && checkOut
      ? differenceInDays(parseISO(checkOut), parseISO(checkIn))
      : null
  );

  const accentColors = [
    { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', icon: '#818CF8' },
    { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', icon: '#22D3EE' },
    { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: '#34D399' },
    { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', icon: '#A78BFA' },
  ];
  const ac = accentColors[index % accentColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{
        background: 'var(--glass-bg)',
        border: `1px solid ${ac.border}`,
        borderRadius: 16,
        padding: '16px 18px',
        display: 'flex',
        gap: 14,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: ac.bg,
          border: `1px solid ${ac.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FiHome size={22} color={ac.icon} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}>
          {name}
        </div>

        {(address || city) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 8 }}>
            <FiMapPin size={12} />
            {[address, city].filter(Boolean).join(', ')}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* Check-in */}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Check-in</div>
            <div style={{ fontSize: '0.85rem', color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              <FiCalendar size={12} color={ac.icon} /> {formatDate(checkIn)}
            </div>
          </div>

          {/* Check-out */}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Check-out</div>
            <div style={{ fontSize: '0.85rem', color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              <FiCalendar size={12} color={ac.icon} /> {formatDate(checkOut)}
            </div>
          </div>

          {/* Nights */}
          {stayNights && (
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Duration</div>
              <div style={{ fontSize: '0.85rem', color: '#D1D5DB', fontWeight: 600 }}>
                {stayNights} night{stayNights !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Room type */}
          {roomType && (
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Room</div>
              <div style={{ fontSize: '0.85rem', color: '#D1D5DB', fontWeight: 500 }}>{roomType}</div>
            </div>
          )}
        </div>

        {/* Confirmation number */}
        {confirmationNumber && (
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              background: ac.bg,
              border: `1px solid ${ac.border}`,
              borderRadius: 8,
              width: 'fit-content',
            }}
          >
            <FiHash size={11} color={ac.icon} />
            <span style={{ fontSize: '0.75rem', color: ac.icon, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              {confirmationNumber}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HotelCard;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSun,
  FiSunrise,
  FiMoon,
  FiMapPin,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiCoffee,
} from 'react-icons/fi';

const timeOfDayConfig = {
  morning: { icon: <FiSunrise size={14} />, label: 'Morning', color: '#F59E0B' },
  afternoon: { icon: <FiSun size={14} />, label: 'Afternoon', color: '#06B6D4' },
  evening: { icon: <FiMoon size={14} />, label: 'Evening', color: '#8B5CF6' },
};

const DayTimeline = ({ days = [] }) => {
  const [expandedDays, setExpandedDays] = useState(new Set([0]));

  const toggleDay = (index) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (!days.length) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px 0' }}>
        No day-by-day plan available yet.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Vertical timeline line */}
      <div
        style={{
          position: 'absolute',
          left: 19,
          top: 24,
          bottom: 24,
          width: 2,
          background: 'linear-gradient(180deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
          borderRadius: 2,
          opacity: 0.4,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {days.map((day, index) => {
          const isExpanded = expandedDays.has(index);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{ display: 'flex', gap: 16 }}
            >
              {/* Day circle */}
              <div style={{ flexShrink: 0, zIndex: 1 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: '#fff',
                    fontFamily: "'Outfit', sans-serif",
                    boxShadow: '0 0 0 3px rgba(99,102,241,0.2), 0 4px 12px rgba(99,102,241,0.4)',
                    border: '2px solid var(--border-color)',
                  }}
                >
                  {day.dayNumber || index + 1}
                </div>
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  marginBottom: 4,
                }}
              >
                {/* Day header */}
                <button
                  onClick={() => toggleDay(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      Day {day.dayNumber || index + 1}
                      {day.date ? ` · ${day.date}` : ''}
                    </div>
                    {day.title && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {day.title}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {day.estimatedCost && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>
                        <FiDollarSign size={12} />
                        {day.estimatedCost}
                      </span>
                    )}
                    <span style={{ color: 'var(--text-tertiary)' }}>
                      {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  </div>
                </button>

                {/* Day content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          padding: '16px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 14,
                        }}
                      >
                        {/* Time slots */}
                        {['morning', 'afternoon', 'evening'].map((time) => {
                          const activities = day[time] || day.activities?.filter((a) => a.time === time) || [];
                          const cfg = timeOfDayConfig[time];
                          if (!activities.length && !day[time]) return null;
                          const items = Array.isArray(activities) ? activities : [activities];

                          return (
                            <div key={time}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                  {cfg.label}
                                </span>
                              </div>
                              {items.map((activity, ai) => (
                                <div
                                  key={ai}
                                  style={{
                                    display: 'flex',
                                    gap: 10,
                                    padding: '8px 10px',
                                    borderRadius: 10,
                                    background: 'rgba(255,255,255,0.03)',
                                    marginBottom: 4,
                                  }}
                                >
                                  <FiMapPin size={13} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.5 }}>
                                    {typeof activity === 'string' ? activity : activity.description || activity.name || JSON.stringify(activity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        })}

                        {/* Meals */}
                        {day.meals && (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <FiCoffee size={13} color="#F59E0B" />
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Meals</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#D1D5DB', margin: 0 }}>
                              {typeof day.meals === 'string' ? day.meals : JSON.stringify(day.meals)}
                            </p>
                          </div>
                        )}

                        {/* General activities if no time slots */}
                        {!day.morning && !day.afternoon && !day.evening && day.activities?.length > 0 && (
                          <div>
                            {day.activities.map((act, i) => (
                              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', marginBottom: 4 }}>
                                <FiMapPin size={13} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.5 }}>
                                  {typeof act === 'string' ? act : act.description || act.name || ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {day.notes && (
                          <div style={{ padding: '10px 12px', background: 'rgba(99,102,241,0.08)', borderRadius: 10, borderLeft: '3px solid #6366F1' }}>
                            <p style={{ fontSize: '0.82rem', color: '#C7D2FE', margin: 0, lineHeight: 1.5 }}>
                              💡 {day.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DayTimeline;

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  FiUpload, FiZap, FiMap, FiShare2, FiFileText, FiGlobe,
  FiArrowRight, FiCheck, FiStar, FiHome, FiCalendar
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';

// Animated counter hook
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return [ref, count];
};

// Floating card component
const FloatingCard = ({ children, style }) => (
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
    className="hero-floating-card"
    style={{
      position: 'absolute',
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 16,
      padding: '12px 16px',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

const features = [
  {
    icon: <FiUpload size={24} />,
    title: 'Upload Documents',
    desc: 'Upload PDFs, images, and scanned documents. We accept all your travel paperwork.',
    color: '#6366F1',
  },
  {
    icon: <FiFileText size={24} />,
    title: 'OCR Extraction',
    desc: 'Our AI reads and extracts key data from your documents with 98% accuracy.',
    color: '#8B5CF6',
  },
  {
    icon: <FiZap size={24} />,
    title: 'AI Generation',
    desc: 'GPT-powered engine crafts beautiful, structured itineraries from your data.',
    color: '#06B6D4',
  },
  {
    icon: <FiMap size={24} />,
    title: 'Day-by-Day Timeline',
    desc: 'Get a detailed daily plan with activities, meals, and local recommendations.',
    color: '#10B981',
  },
  {
    icon: <FiShare2 size={24} />,
    title: 'Easy Sharing',
    desc: 'Share with friends via link, QR code, WhatsApp, or email instantly.',
    color: '#F59E0B',
  },
  {
    icon: <FiGlobe size={24} />,
    title: '150+ Countries',
    desc: 'Local recommendations, cultural tips, and hidden gems for every destination.',
    color: '#EF4444',
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload Your Docs',
    desc: 'Drop your flight tickets, hotel bookings, and travel documents.',
    icon: <FiUpload size={28} color="#6366F1" />,
  },
  {
    number: '02',
    title: 'AI Processes Them',
    desc: 'Our AI extracts flights, hotels, and key travel details automatically.',
    icon: <FiZap size={28} color="#8B5CF6" />,
  },
  {
    number: '03',
    title: 'Get Your Itinerary',
    desc: 'Receive a beautiful, shareable day-by-day travel plan in seconds.',
    icon: <FaPlane size={28} color="#06B6D4" style={{ transform: 'rotate(-45deg)' }} />,
  },
];

const Landing = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [r1, c1] = useCounter(10000);
  const [r2, c2] = useCounter(50000);
  const [r3, c3] = useCounter(98);
  const [r4, c4] = useCounter(150);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 4vw, 40px)',
          height: 64,
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link
            to="/login"
            style={{
              padding: '8px 18px',
              color: 'var(--text-secondary)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            style={{
              padding: '9px 20px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: 10,
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 80,
        }}
      >
        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-20%', left: '-10%',
              width: 600, height: 600,
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', bottom: '-20%', right: '-10%',
              width: 700, height: 700,
              background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{
              position: 'absolute', top: '40%', left: '50%',
              width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Floating decoration cards */}
        <FloatingCard style={{ top: '18%', left: '5%', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.8 }}>
          <FaPlane size={18} color="#6366F1" style={{ transform: 'rotate(-45deg)' }} />
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Flight Detected</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>NYC → London · BA 178</div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ top: '25%', right: '6%', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.8 }}>
          <FiHome size={18} color="#22D3EE" />
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Hotel Booked</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>The Ritz · Check-in Apr 12</div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ bottom: '28%', left: '4%', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.75 }}>
          <FiCalendar size={18} color="#34D399" />
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>Itinerary Ready</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>7-day plan generated</div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ bottom: '22%', right: '5%', display: 'flex', alignItems: 'center', gap: 8, opacity: 0.75 }}>
          <FiStar size={16} color="#F59E0B" />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>98% Accuracy</span>
        </FloatingCard>

        {/* Hero content */}
        <div style={{ textAlign: 'center', maxWidth: 800, padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 99,
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#818CF8',
                marginBottom: 24,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <FiZap size={13} /> AI-Powered Travel Planning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}
          >
            Turn Your Travel Docs Into{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Beautiful Itineraries
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              marginBottom: 36,
              maxWidth: 580,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}
          >
            Upload your flight tickets, hotel bookings, and travel documents.
            Our AI instantly crafts a stunning day-by-day travel plan — no manual work needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                borderRadius: 12,
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
            >
              Start Free <FiArrowRight size={16} />
            </Link>
            <button
              onClick={scrollToFeatures}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color-hover)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-color)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              See How It Works
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}
          >
            {['✓ Free to start', '✓ No credit card', '✓ 10K+ trips planned'].map((t) => (
              <span key={t} style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontFamily: "'Inter', sans-serif" }}>
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section ref={featuresRef} style={{ padding: '100px clamp(16px, 4vw, 40px)', background: 'rgba(17,24,39,0.5)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 14px',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 99,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#818CF8',
                  marginBottom: 16,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Features
              </span>
              <h2
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  color: 'var(--text-primary)',
                  marginBottom: 14,
                }}
              >
                Everything You Need for{' '}
                <span style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Perfect Trips
                </span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
                From document upload to ready-to-share itinerary — all in under 60 seconds.
              </p>
            </motion.div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 18,
                  padding: '24px',
                  transition: 'all 0.25s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${f.color}44`; e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px clamp(16px, 4vw, 40px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: 14 }}
            >
              How It Works
            </motion.h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>Three steps to your perfect travel plan</p>
          </div>

          <div style={{ display: 'flex', gap: 0, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
            {steps.map((step, i) => (
              <React.Fragment key={step.number}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  style={{
                    flex: '1 1 240px',
                    maxWidth: 260,
                    textAlign: 'center',
                    padding: '0 20px',
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                      border: '2px solid rgba(99,102,241,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: 28,
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: 'rgba(99,102,241,0.2)',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {step.number}
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', marginTop: -40 }}>
                    <FiArrowRight size={24} color="rgba(99,102,241,0.3)" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ padding: '80px clamp(16px, 4vw, 40px)', background: 'rgba(17,24,39,0.5)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { ref: r1, count: c1, suffix: 'K+', label: 'Trips Planned', color: '#818CF8' },
              { ref: r2, count: c2, suffix: 'K+', label: 'Documents Processed', color: '#22D3EE' },
              { ref: r3, count: c3, suffix: '%', label: 'Accuracy Rate', color: '#34D399' },
              { ref: r4, count: c4, suffix: '+', label: 'Countries Covered', color: '#FBBF24' },
            ].map(({ ref, count, suffix, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                ref={ref}
                style={{
                  textAlign: 'center',
                  padding: '28px 20px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '2.8rem',
                    color,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {count}{suffix}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '100px clamp(16px, 4vw, 40px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              padding: '60px clamp(16px, 4vw, 40px)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.10) 50%, rgba(6,182,212,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 28,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
            <FiGlobe size={48} color="#6366F1" style={{ marginBottom: 20, display: 'block' }} />
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: 14 }}>
              Start Planning Your{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dream Trip
              </span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.7 }}>
              Join thousands of travelers who turn their documents into beautiful itineraries in seconds.
            </p>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                borderRadius: 12,
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
              }}
            >
              Get Started — It's Free <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '32px clamp(16px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaPlane size={16} color="var(--text-secondary)" style={{ transform: 'rotate(-45deg)' }} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            AI Travel Planner
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textDecoration: 'none', fontFamily: "'Inter', sans-serif", transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
            >
              {link}
            </a>
          ))}
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
          © 2024 AI Travel Planner. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;

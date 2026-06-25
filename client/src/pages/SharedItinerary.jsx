import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  FiMapPin, FiCalendar, FiShare2, FiHome, FiMail,
  FiChevronLeft, FiExternalLink, FiCopy, FiCheck, FiCpu, FiStar
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import PageWrapper from '../components/layout/PageWrapper';
import FlightCard from '../components/itinerary/FlightCard';
import HotelCard from '../components/itinerary/HotelCard';
import DayTimeline from '../components/itinerary/DayTimeline';
import ExportButton from '../components/shared/ExportButton';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { getSharedItinerary } from '../api/itineraryApi';
import useToast from '../hooks/useToast';

const SharedItinerary = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['sharedItinerary', code],
    queryFn: () => getSharedItinerary(code),
    retry: 1,
  });

  const itinerary = data?.itinerary || data;
  const fullUrl = window.location.href;

  useEffect(() => {
    if (!itinerary) return;
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(fullUrl, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0A0F1E',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      }).then((url) => setQrUrl(url));
    });
  }, [itinerary, fullUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this travel itinerary: ${fullUrl}`)}`);
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=Travel Itinerary for ${itinerary?.destination || 'Trip'}&body=${encodeURIComponent(`Hey!\n\nTake a look at this awesome travel itinerary:\n\n${fullUrl}`)}`);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return format(parseISO(d), 'MMM d, yyyy'); }
    catch { return d; }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page-container" style={{ maxWidth: 1100 }}>
          <Skeleton variant="rectangular" height={200} style={{ borderRadius: 20, marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" />)}
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !itinerary) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: '120px 20px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
          <FaPlane size={64} color="#6366F1" style={{ transform: 'rotate(-45deg)', marginBottom: 16, display: 'inline-block' }} />
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-primary)', marginTop: 16 }}>Itinerary Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", marginBottom: 24, maxWidth: 450, margin: '12px auto 24px' }}>
            The link you followed might be broken, or the owner has made the itinerary private or deleted it.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </PageWrapper>
    );
  }

  const { title, destination, startDate, endDate, flights = [], hotels = [], days = [], summary, recommendations } = itinerary;

  return (
    <PageWrapper>
      {/* Public Header */}
      <header className="no-print" style={{
        background: 'rgba(17, 24, 39, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <FaPlane size={20} color="#6366F1" style={{ transform: 'rotate(-45deg)', marginRight: 8 }} />
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI Travel Planner
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
            Plan Your Trip Free
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="page-container" style={{ maxWidth: 1100, paddingBottom: 100 }}>
        
        {/* Cover Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.10) 50%, rgba(6,182,212,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 24,
            padding: '32px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Badge variant="success">Shared Itinerary</Badge>
                {destination && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                    <FiMapPin size={14} />
                    {destination}
                  </div>
                )}
              </div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'var(--text-primary)', marginBottom: 8 }}>
                {title || 'Shared Trip'}
              </h1>
              {(startDate || endDate) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                  <FiCalendar size={14} />
                  {formatDate(startDate)} {endDate ? `→ ${formatDate(endDate)}` : ''}
                </div>
              )}
            </div>

            {/* Print button (visible on desktop) */}
            <div className="no-print" style={{ display: 'flex', gap: 8 }}>
              <ExportButton label="Print / Save PDF" size="sm" />
            </div>
          </div>
        </motion.div>

        {/* AI Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(99,102,241,0.07)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 18,
              padding: '20px 24px',
              marginBottom: 24,
              borderLeft: '4px solid #6366F1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <FiCpu size={18} color="#818CF8" />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#818CF8', margin: 0 }}>AI Summary</h3>
            </div>
            <p style={{ color: '#C7D2FE', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, fontFamily: "'Inter', sans-serif" }}>
              {summary}
            </p>
          </motion.div>
        )}

        {/* Flights */}
        {flights.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaPlane size={20} color="#818CF8" /> Flights ({flights.length})
            </h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {flights.map((f, i) => <FlightCard key={i} flight={f} index={i} />)}
            </div>
          </section>
        )}

        {/* Hotels */}
        {hotels.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiHome size={20} color="#22D3EE" /> Hotels ({hotels.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
              {hotels.map((h, i) => <HotelCard key={i} hotel={h} index={i} />)}
            </div>
          </section>
        )}

        {/* Day Timeline */}
        {days.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCalendar size={20} color="#818CF8" /> Day-by-Day Itinerary
            </h2>
            <DayTimeline days={days} />
          </section>
        )}

        {/* Recommendations */}
        {recommendations && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiStar size={20} color="#F59E0B" /> Recommendations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {Object.entries(recommendations).map(([key, value]) => (
                <div key={key} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '20px' }}>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', textTransform: 'capitalize', marginBottom: 12 }}>
                    {key}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                    {typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Share & QR Code Panel (Public view footer) */}
        <section className="no-print" style={{
          marginTop: 48,
          background: 'var(--glass-bg)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20,
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        }}>
          <div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              Like this itinerary?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Share it with your co-travelers or generate your own using our AI Travel Planner!
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Button variant="secondary" size="sm" onClick={handleCopy} icon={copied ? <FiCheck /> : <FiCopy />}>
                {copied ? 'Copied' : 'Copy Link'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleWhatsApp} icon={<FiShare2 />}>
                WhatsApp
              </Button>
              <Button variant="secondary" size="sm" onClick={handleEmail} icon={<FiMail />}>
                Email
              </Button>
            </div>
          </div>

          {qrUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: 10, borderRadius: 12 }}>
                <img src={qrUrl} alt="QR Code" style={{ width: 100, height: 100 }} />
              </div>
              <div>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  Mobile QR
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', width: 120, margin: 0, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
                  Scan to view this itinerary on your phone.
                </p>
              </div>
            </div>
          )}
        </section>

      </div>
    </PageWrapper>
  );
};

export default SharedItinerary;

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiMapPin, FiCalendar, FiEdit2, FiShare2, FiTrash2, FiChevronLeft,
  FiHome, FiMessageSquare, FiSend, FiX, FiStar, FiDollarSign,
  FiShoppingBag, FiCpu, FiFrown,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import FlightCard from '../components/itinerary/FlightCard';
import HotelCard from '../components/itinerary/HotelCard';
import DayTimeline from '../components/itinerary/DayTimeline';
import ShareModal from '../components/shared/ShareModal';
import ExportButton from '../components/shared/ExportButton';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { getItinerary, deleteItinerary, shareItinerary } from '../api/itineraryApi';
import { chatWithItinerary } from '../api/aiApi';
import useToast from '../hooks/useToast';

const statusMap = { draft: 'draft', generating: 'warning', generated: 'primary', published: 'success' };

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => getItinerary(id),
    retry: 1,
  });

  const itinerary = data?.itinerary || data;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this itinerary? This cannot be undone.')) return;
    try {
      await deleteItinerary(id);
      toast.success('Itinerary deleted');
      navigate('/history');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareItinerary(id);
      const code = result.shareCode || result.code;
      setShareData({ code, url: `${window.location.origin}/share/${code}` });
      setShareOpen(true);
    } catch {
      // If already shared, use existing
      if (itinerary?.shareCode) {
        setShareData({ code: itinerary.shareCode, url: `${window.location.origin}/share/${itinerary.shareCode}` });
        setShareOpen(true);
      } else {
        toast.error('Failed to generate share link');
      }
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);

    try {
      const result = await chatWithItinerary(id, msg);
      const reply = result.response || result.message || result.answer || 'I can help you with your itinerary!';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I had trouble processing that. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return format(parseISO(d), 'MMM d, yyyy'); }
    catch { return d; }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Navbar />
        <div className="page-container" style={{ maxWidth: 1100 }}>
          <Skeleton variant="rectangular" height={200} style={{ borderRadius: 20, marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[1,2,3,4].map(i => <Skeleton key={i} variant="card" />)}
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !itinerary) {
    return (
      <PageWrapper>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <FiFrown size={60} color="var(--text-secondary)" style={{ marginBottom: 16, display: 'inline-block' }} />
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'var(--text-primary)', marginTop: 16 }}>Itinerary Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>This itinerary may have been deleted.</p>
          <Button variant="primary" onClick={() => navigate('/history')}>← Back to History</Button>
        </div>
      </PageWrapper>
    );
  }

  const { title, destination, startDate, endDate, status, flights = [], hotels = [], days = [], summary, recommendations } = itinerary;

  return (
    <PageWrapper>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 1100, paddingBottom: 100 }}>
        {/* Back button */}
        <button
          className="no-print"
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', marginBottom: 20, padding: 0 }}
        >
          <FiChevronLeft size={16} /> Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.10) 50%, rgba(6,182,212,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 24,
            padding: '28px 32px',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Badge variant={statusMap[status] || 'draft'} dot>{status || 'draft'}</Badge>
                {destination && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                    <FiMapPin size={14} />
                    {destination}
                  </div>
                )}
              </div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text-primary)', marginBottom: 8 }}>
                {title || 'My Trip'}
              </h1>
              {(startDate || endDate) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                  <FiCalendar size={14} />
                  {formatDate(startDate)} {endDate ? `→ ${formatDate(endDate)}` : ''}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" icon={<FiShare2 size={14} />} onClick={handleShare}>Share</Button>
              <ExportButton size="sm" />
              <Button variant="danger" size="sm" icon={<FiTrash2 size={14} />} onClick={handleDelete}>Delete</Button>
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
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaPlane size={18} color="#818CF8" /> Flights ({flights.length})
            </h2>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {flights.map((f, i) => <FlightCard key={i} flight={f} index={i} />)}
            </div>
          </section>
        )}

        {/* Hotels */}
        {hotels.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiHome size={18} color="#22D3EE" /> Hotels ({hotels.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 14 }}>
              {hotels.map((h, i) => <HotelCard key={i} hotel={h} index={i} />)}
            </div>
          </section>
        )}

        {/* Day Timeline */}
        {days.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCalendar size={18} color="#818CF8" /> Day-by-Day Itinerary
            </h2>
            <DayTimeline days={days} />
          </section>
        )}

        {/* Recommendations */}
        {recommendations && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiStar size={18} color="#F59E0B" /> Recommendations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {Object.entries(recommendations).map(([key, value]) => (
                <div key={key} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px' }}>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'capitalize', marginBottom: 10 }}>
                    {key}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0, fontFamily: "'Inter', sans-serif" }}>
                    {typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* AI Chat Widget */}
      <div className="no-print chat-widget-container">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="chat-window"
            >
              {/* Chat header */}
              <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiCpu size={18} color="#818CF8" />
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Trip Assistant</div>
                    <div style={{ fontSize: '0.7rem', color: '#34D399' }}>● Online</div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                  <FiX size={16} />
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                    <FiMessageSquare size={36} color="#818CF8" style={{ marginBottom: 12, display: 'inline-block' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", marginTop: 8 }}>
                      Ask me anything about your trip!
                    </p>
                    {['Best restaurants?', 'What to pack?', 'Local tips?'].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setChatInput(q); }}
                        style={{ display: 'block', width: '100%', padding: '7px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#818CF8', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', marginTop: 6, textAlign: 'left' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: m.role === 'user' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.07)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      lineHeight: 1.5,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: 'flex', gap: 4, padding: '8px 12px' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1' }} />
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
                  placeholder="Ask about your trip..."
                  style={{
                    flex: 1, padding: '9px 12px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", outline: 'none',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleChat}
                  disabled={!chatInput.trim() || chatLoading}
                  style={{ padding: '9px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', borderRadius: 10, color: '#fff', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display: 'flex', opacity: chatInput.trim() ? 1 : 0.5 }}
                >
                  <FiSend size={15} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen((v) => !v)}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
            color: '#fff',
          }}
        >
          {chatOpen ? <FiX size={20} /> : <FiMessageSquare size={20} />}
        </motion.button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        shareCode={shareData?.code}
        shareUrl={shareData?.url}
      />
    </PageWrapper>
  );
};

export default ItineraryDetail;

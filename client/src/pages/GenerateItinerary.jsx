import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiCheck, FiChevronRight, FiFile, FiZap, FiEdit2 } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { getUploadHistory } from '../api/uploadApi';
import { generateItinerary } from '../api/aiApi';
import useToast from '../hooks/useToast';

const STEPS = ['Select Files', 'Preview Data', 'Generating...', 'Done!'];

const aiMessages = [
  'Analyzing your documents...',
  'Extracting flight information...',
  'Processing hotel details...',
  'Crafting your day-by-day plan...',
  'Adding local recommendations...',
  'Finalizing your itinerary...',
  'Almost ready...',
];

const GenerateItinerary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState(new Set(location.state?.fileIds || []));
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessageIdx, setAiMessageIdx] = useState(0);
  const [generatedId, setGeneratedId] = useState(null);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['uploadHistory'],
    queryFn: () => getUploadHistory(1, 50),
    retry: 1,
  });

  const uploads = historyData?.files || historyData?.uploads || historyData?.data || [];

  // Cycle AI messages during generation
  useEffect(() => {
    if (!isGenerating) return;
    const timer = setInterval(() => {
      setAiMessageIdx((i) => (i + 1) % aiMessages.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!selectedIds.size) {
      toast.warning('Select at least one file');
      return;
    }
    setStep(2);
    setIsGenerating(true);
    setAiMessageIdx(0);

    try {
      const fileIds = [...selectedIds];
      const result = await generateItinerary(fileIds, title || 'My Trip');
      const id = result.itinerary?._id || result._id || result.id;
      setGeneratedId(id);
      setStep(3);
      toast.success('Itinerary generated successfully!');
      setTimeout(() => {
        navigate(`/itinerary/${id}`);
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Generation failed');
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 900 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
          <span>Dashboard</span>
          <FiChevronRight size={12} />
          <span style={{ color: 'var(--text-primary)' }}>Generate Itinerary</span>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <motion.div
                  animate={{
                    borderColor: i <= step ? '#6366F1' : 'var(--border-color-hover)',
                    scale: i === step ? 1.1 : 1,
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '2px solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: i <= step ? '#fff' : 'var(--text-tertiary)',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    background: i <= step ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'var(--glass-bg)',
                    transition: 'background 0.3s, color 0.3s',
                  }}
                >
                  {i < step ? <FiCheck size={16} /> : i + 1}
                </motion.div>
                <span style={{ fontSize: '0.72rem', color: i === step ? '#818CF8' : 'var(--text-tertiary)', fontFamily: "'Inter', sans-serif", fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'linear-gradient(90deg, #6366F1, #8B5CF6)' : 'var(--border-color)', margin: '0 8px', marginTop: -16, borderRadius: 2, transition: 'background 0.4s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Select Files */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '28px' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                  Select Documents
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', marginBottom: 20 }}>
                  Choose the files you want to use for generating your itinerary.
                </p>

                {isLoading ? (
                  <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>Loading your documents...</p>
                ) : uploads.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <FiFile size={48} color="var(--text-secondary)" style={{ marginBottom: 12, display: 'inline-block' }} />
                    <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontFamily: "'Inter', sans-serif" }}>
                      No documents uploaded yet.{' '}
                      <button onClick={() => navigate('/upload')} style={{ color: '#818CF8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                        Upload now →
                      </button>
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                    {uploads.map((f) => {
                      const id = f._id || f.id;
                      const isSelected = selectedIds.has(id);
                      return (
                        <motion.div
                          key={id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleSelect(id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                            borderRadius: 12, cursor: 'pointer',
                            background: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isSelected ? 'rgba(99,102,241,0.4)' : 'var(--border-color)'}`,
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: isSelected ? 'rgba(99,102,241,0.2)' : 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#818CF8' : 'var(--text-secondary)', flexShrink: 0 }}>
                            <FiFile size={18} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {f.originalName || f.filename || f.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{f.status || 'uploaded'}</div>
                          </div>
                          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${isSelected ? '#818CF8' : 'var(--text-tertiary)'}`, background: isSelected ? '#6366F1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                            {isSelected && <FiCheck size={11} color="#fff" />}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(1)}
                    disabled={!selectedIds.size}
                    icon={<FiChevronRight size={16} />}
                  >
                    Next: Preview Data
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Preview & Title */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '28px' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                  Preview & Configure
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', marginBottom: 24 }}>
                  {selectedIds.size} file{selectedIds.size !== 1 ? 's' : ''} selected. Give your itinerary a name.
                </p>

                {/* Selected files preview */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
                    Selected Files
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...selectedIds].map((id) => {
                      const f = uploads.find((u) => (u._id || u.id) === id);
                      return f ? (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--glass-bg)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                          <FiFile size={15} color="#818CF8" />
                          <span style={{ color: '#D1D5DB', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                            {f.originalName || f.filename || f.name}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Title input */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                    <FiEdit2 size={13} style={{ display: 'inline', marginRight: 5 }} />
                    Itinerary Title (optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer Europe Trip 2024"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 12,
                      color: 'var(--text-primary)',
                      fontSize: '0.9375rem',
                      fontFamily: "'Inter', sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                {/* AI info card */}
                <div style={{ padding: '14px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <FiZap size={20} color="#818CF8" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: '#C7D2FE', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", margin: 0, lineHeight: 1.5 }}>
                      Our AI will analyze all {selectedIds.size} file{selectedIds.size !== 1 ? 's' : ''} and create a complete day-by-day itinerary with flights, hotels, activities, and local recommendations.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                  <Button variant="secondary" onClick={() => setStep(0)}>
                    ← Back
                  </Button>
                  <Button variant="primary" size="lg" onClick={handleGenerate} icon={<FiZap size={16} />}>
                    Generate Itinerary
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Generating */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 24 }}>
                {/* Animated plane */}
                <div style={{ position: 'relative', height: 120, marginBottom: 32 }}>
                  <motion.div
                    animate={{ x: ['-10%', '110%'], y: [0, -20, 10, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <FaPlane size={48} color="#6366F1" style={{ transform: 'rotate(-45deg)' }} />
                  </motion.div>
                  {/* Trail */}
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)', transform: 'translateY(-50%)' }} />
                </div>

                {/* Spinning orb */}
                <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 100, height: 100, borderRadius: '50%',
                      border: '3px solid transparent',
                      borderTopColor: '#6366F1',
                      borderRightColor: '#8B5CF6',
                      position: 'absolute', inset: 0,
                    }}
                  />
                  <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiZap size={36} color="#8B5CF6" />
                  </div>
                </div>

                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                  Creating Your Itinerary
                </h2>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={aiMessageIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", fontSize: '1rem' }}
                  >
                    {aiMessages[aiMessageIdx]}
                  </motion.p>
                </AnimatePresence>

                {/* Progress dots */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                      style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1' }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 24 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  style={{ display: 'inline-block', marginBottom: 20 }}
                >
                  <FiCheck size={80} color="#10B981" />
                </motion.div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#10B981', marginBottom: 10 }}>
                  Itinerary Created!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
                  Redirecting to your itinerary...
                </p>
                <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, ease: 'easeOut' }} style={{ height: 3, background: 'linear-gradient(90deg, #10B981, #06B6D4)', borderRadius: 2, marginTop: 20, maxWidth: 300, margin: '20px auto 0' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default GenerateItinerary;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck, FiShare2, FiMail, FiLink } from 'react-icons/fi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ShareModal = ({ isOpen, onClose, shareUrl, shareCode }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef(null);

  const fullUrl = shareUrl || (shareCode ? `${window.location.origin}/share/${shareCode}` : '');

  // Generate QR code using qrcode library
  useEffect(() => {
    if (!isOpen || !fullUrl) return;
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(fullUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0A0F1E',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      }).then((url) => setQrDataUrl(url));
    });
  }, [isOpen, fullUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = fullUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my travel itinerary: ${fullUrl}`)}`);
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=My Travel Itinerary&body=${encodeURIComponent(`I wanted to share my travel itinerary with you!\n\n${fullUrl}`)}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Itinerary" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Share link */}
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
            SHAREABLE LINK
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                overflow: 'hidden',
              }}
            >
              <FiLink size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.82rem',
                  color: '#D1D5DB',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {fullUrl || 'No share link available'}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              disabled={!fullUrl}
              style={{
                padding: '10px 16px',
                background: copied
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(99,102,241,0.15)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.35)' : 'rgba(99,102,241,0.35)'}`,
                borderRadius: 10,
                color: copied ? '#34D399' : '#818CF8',
                cursor: fullUrl ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: '0.85rem',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FiCheck size={14} /> Copied!
                  </motion.span>
                ) : (
                  <motion.span key="copy" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FiCopy size={14} /> Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 12 }}>
              QR CODE
            </label>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'inline-block',
                padding: 14,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <img src={qrDataUrl} alt="QR Code" style={{ width: 160, height: 160, borderRadius: 8 }} />
            </motion.div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8 }}>
              Scan to open the itinerary
            </p>
          </div>
        )}

        {/* Share buttons */}
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 10 }}>
            SHARE VIA
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleWhatsApp}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(37,211,102,0.12)',
                border: '1px solid rgba(37,211,102,0.3)',
                borderRadius: 12,
                color: '#25D366',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <FiShare2 size={15} /> WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEmail}
              style={{
                flex: 1,
                padding: '10px',
                background: 'rgba(6,182,212,0.12)',
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: 12,
                color: '#22D3EE',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <FiMail size={15} /> Email
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;

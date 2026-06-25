import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiGlobe, FiZap, FiMap, FiStar, FiCheck, FiHome } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import Button from '../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

const InputField = React.forwardRef(({ label, icon, error, type = 'text', rightElement, ...rest }, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.03em' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? '#EF4444' : 'var(--text-tertiary)', display: 'flex' }}>
        {icon}
      </div>
      <input
        type={type}
        ref={ref}
        {...rest}
        style={{
          width: '100%',
          padding: '12px 14px 12px 42px',
          paddingRight: rightElement ? 46 : 14,
          background: 'var(--glass-bg)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'}`,
          borderRadius: 12,
          color: 'var(--text-primary)',
          fontSize: '0.9375rem',
          fontFamily: "'Inter', sans-serif",
          outline: 'none',
          transition: 'all 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
      {rightElement && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ color: '#EF4444', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, margin: 0, fontFamily: "'Inter', sans-serif" }}
      >
        <FiAlertCircle size={12} /> {error}
      </motion.p>
    )}
  </div>
));

InputField.displayName = 'InputField';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Left: Illustration Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, #1a1f35 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="auth-illustration"
      >
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          {/* Floating travel icons */}
          {[
            { icon: <FiGlobe size={32} color="#6366F1" />, top: '15%', left: '8%', right: undefined },
            { icon: <FiZap size={28} color="#8B5CF6" />, top: '30%', left: undefined, right: '6%' },
            { icon: <FiMap size={36} color="#10B981" />, top: '48%', left: '10%', right: undefined },
            { icon: <FiStar size={30} color="#F59E0B" />, top: '65%', left: undefined, right: '8%' },
            { icon: <FaPlane size={32} color="#06B6D4" style={{ transform: 'rotate(-45deg)' }} />, top: '80%', left: '12%', right: undefined },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -(8 + i * 3), 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                right: item.right,
                opacity: 0.25,
              }}
            >
              {item.icon}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FaPlane size={56} color="#6366F1" style={{ transform: 'rotate(-45deg)', marginBottom: 24, display: 'inline-block' }} />
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '2rem',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 14,
              }}
            >
              Your Journey Awaits
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
              Turn your travel documents into beautifully crafted AI-powered itineraries — instantly.
            </p>

            {/* Feature bullets */}
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {[
                'Upload PDFs and images',
                'AI-powered OCR extraction',
                'Instant itinerary generation',
                'Share with anyone, anywhere',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#818CF8', fontSize: 10 }}>✓</span>
                  </div>
                  <span style={{ color: '#D1D5DB', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          flexShrink: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <FaPlane size={20} color="#6366F1" style={{ transform: 'rotate(-45deg)' }} />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI Travel Planner
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '2rem',
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32, fontFamily: "'Inter', sans-serif" }}>
            Sign in to continue planning your adventures.
          </p>

          {/* Server error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10,
                marginBottom: 20,
                color: '#F87171',
                fontSize: '0.875rem',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <FiAlertCircle size={15} /> {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <InputField
              label="Email Address"
              icon={<FiMail size={16} />}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <InputField
              label="Password"
              icon={<FiLock size={16} />}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: 2 }}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
              {...register('password')}
            />

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
                style={{ accentColor: '#6366F1', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                Remember me
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} fullWidth>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 24, fontFamily: "'Inter', sans-serif" }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-illustration { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;

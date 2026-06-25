import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiGlobe, FiZap, FiShare2, FiStar, FiMap } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import Button from '../components/ui/Button';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: 'Too weak', color: '#EF4444' },
    { label: 'Weak', color: '#F59E0B' },
    { label: 'Fair', color: '#F59E0B' },
    { label: 'Strong', color: '#10B981' },
    { label: 'Very strong', color: '#10B981' },
  ];
  return { score, ...map[score] };
};

const InputField = React.forwardRef(({ label, icon, error, type = 'text', rightElement, ...rest }, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
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
          padding: '11px 14px 11px 42px',
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

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const password = watch('password', '');
  const strength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser({ fullName: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome aboard');
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create account';
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left Illustration */}
      <div
        className="auth-illustration"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          background: 'linear-gradient(135deg, var(--bg-surface), #1a1f35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

        {[
          { icon: <FiGlobe size={32} color="#6366F1" />, top: '15%', left: '8%', right: undefined },
          { icon: <FiZap size={28} color="#8B5CF6" />, top: '30%', left: undefined, right: '6%' },
          { icon: <FiMap size={36} color="#10B981" />, top: '48%', left: '10%', right: undefined },
          { icon: <FiStar size={30} color="#F59E0B" />, top: '65%', left: undefined, right: '8%' },
          { icon: <FaPlane size={32} color="#06B6D4" style={{ transform: 'rotate(-45deg)' }} />, top: '80%', left: '12%', right: undefined },
        ].map((item, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -(6 + i * 4), 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0] }}
            transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
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
          style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 380 }}
        >
          <FiGlobe size={56} color="#6366F1" style={{ marginBottom: 20, display: 'inline-block' }} />
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '2rem',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #06B6D4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12,
          }}>
            Plan. Explore. Share.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
            Join thousands of travelers who create stunning itineraries from their travel documents.
          </p>

          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: <FiZap size={16} color="#6366F1" />, text: 'Instant generation' },
              { icon: <FiLock size={16} color="#8B5CF6" />, text: 'Secure & private' },
              { icon: <FiShare2 size={16} color="#06B6D4" />, text: 'Share anywhere' },
              { icon: <FiCheck size={16} color="#10B981" />, text: 'Free to start' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                textAlign: 'left',
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ color: '#D1D5DB', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Register Form */}
      <div style={{ width: '100%', maxWidth: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', flexShrink: 0, overflowY: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: 22 }}>✈️</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Travel Planner
            </span>
          </div>

          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 28, fontFamily: "'Inter', sans-serif" }}>
            Start planning smarter. No credit card required.
          </p>

          {serverError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, marginBottom: 20, color: '#F87171', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
              <FiAlertCircle size={15} /> {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InputField label="Full Name" icon={<FiUser size={15} />} placeholder="John Doe" error={errors.name?.message} {...register('name')} />
            <InputField label="Email Address" icon={<FiMail size={15} />} type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />

            <div>
              <InputField
                label="Password"
                icon={<FiLock size={15} />}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                rightElement={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: 2 }}>
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                }
                {...register('password')}
              />
              {/* Password strength indicator */}
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background: i <= strength.score ? strength.color : 'var(--border-color)',
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strength.color, fontFamily: "'Inter', sans-serif" }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <InputField
              label="Confirm Password"
              icon={<FiLock size={15} />}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              rightElement={
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: 2 }}>
                  {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              }
              {...register('confirmPassword')}
            />

            {/* Terms */}
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <input type="checkbox" id="terms" {...register('terms')} style={{ accentColor: '#6366F1', cursor: 'pointer', marginTop: 3 }} />
                <label htmlFor="terms" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                  I agree to the{' '}
                  <span style={{ color: '#818CF8', fontWeight: 600 }}>Terms of Service</span>{' '}
                  and{' '}
                  <span style={{ color: '#818CF8', fontWeight: 600 }}>Privacy Policy</span>
                </label>
              </div>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif" }}
                >
                  <FiAlertCircle size={12} /> {errors.terms.message}
                </motion.p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} fullWidth>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 20, fontFamily: "'Inter', sans-serif" }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`@media (max-width: 768px) { .auth-illustration { display: none !important; } }`}</style>
    </div>
  );
};

export default Register;

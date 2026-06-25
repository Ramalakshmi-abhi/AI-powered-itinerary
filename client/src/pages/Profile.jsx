import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera, FiAlertCircle, FiSun, FiMoon, FiTrash2, FiSettings } from 'react-icons/fi';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import useToast from '../hooks/useToast';
import { changePassword, deleteAccount } from '../api/authApi';
import { format } from 'date-fns';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const InputField = React.forwardRef(({ label, icon, error, type = 'text', rightElement, ...rest }, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>{label}</label>}
    <div style={{ position: 'relative' }}>
      {icon && <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}>{icon}</div>}
      <input
        type={type}
        {...rest}
        ref={ref}
        style={{
          width: '100%', padding: `11px 14px 11px ${icon ? '42px' : '14px'}`,
          paddingRight: rightElement ? 44 : 14,
          background: 'var(--glass-bg)', border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'}`,
          borderRadius: 12, color: 'var(--text-primary)', fontSize: '0.9375rem',
          fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
      {rightElement && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightElement}</div>}
    </div>
    {error && <p style={{ color: '#EF4444', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, margin: 0, fontFamily: "'Inter', sans-serif" }}><FiAlertCircle size={12} />{error}</p>}
  </div>
));

InputField.displayName = 'InputField';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const toast = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.fullName || '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onProfileSubmit = async (data) => {
    try {
      await updateUser({ fullName: data.name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteAccount();
      await logout();
      window.location.href = '/';
    } catch {
      toast.error('Failed to delete account');
    }
  };

  const memberSince = user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently';

  return (
    <PageWrapper>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 900 }}>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 28 }}
        >
          Profile & Settings
        </motion.h1>

        <div className="profile-grid">
          {/* Profile card */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="profile-sidebar"
            >
              {/* Avatar */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <Avatar name={user?.fullName || user?.email} size={88} />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    border: '2px solid var(--bg-surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                  }}
                >
                  <FiCamera size={13} />
                </motion.button>
              </div>

              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                {user?.fullName || 'User'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>
                {user?.email}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>
                Member since {memberSince}
              </p>

              <div style={{ marginTop: 20, padding: '12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Account Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ color: '#34D399', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>Active</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Settings panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Edit Profile */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '24px' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiUser size={16} color="#818CF8" /> Edit Profile
                </h3>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <InputField
                    label="Full Name"
                    icon={<FiUser size={14} />}
                    placeholder="Your full name"
                    error={profileForm.formState.errors.name?.message}
                    {...profileForm.register('name')}
                  />
                  <InputField label="Email Address" icon={<FiMail size={14} />} value={user?.email || ''} disabled />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="primary" size="md" isLoading={profileForm.formState.isSubmitting}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Change Password */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '24px' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiLock size={16} color="#22D3EE" /> Change Password
                </h3>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <InputField
                    label="Current Password"
                    icon={<FiLock size={14} />}
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    error={passwordForm.formState.errors.currentPassword?.message}
                    rightElement={<button type="button" onClick={() => setShowCurrent(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: 2 }}>{showCurrent ? <FiEyeOff size={14} /> : <FiEye size={14} />}</button>}
                    {...passwordForm.register('currentPassword')}
                  />
                  <InputField
                    label="New Password"
                    icon={<FiLock size={14} />}
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    error={passwordForm.formState.errors.newPassword?.message}
                    rightElement={<button type="button" onClick={() => setShowNew(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: 2 }}>{showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}</button>}
                    {...passwordForm.register('newPassword')}
                  />
                  <InputField
                    label="Confirm New Password"
                    icon={<FiLock size={14} />}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    error={passwordForm.formState.errors.confirmPassword?.message}
                    rightElement={<button type="button" onClick={() => setShowConfirm(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', padding: 2 }}>{showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}</button>}
                    {...passwordForm.register('confirmPassword')}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="primary" size="md" isLoading={passwordForm.formState.isSubmitting}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '24px' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiSettings size={18} color="var(--text-secondary)" /> Preferences
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif" }}>
                      Toggle display theme
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    style={{
                      width: 48, height: 26,
                      borderRadius: 13,
                      background: isDark ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'var(--border-color-hover)',
                      border: 'none', cursor: 'pointer',
                      position: 'relative', transition: 'all 0.3s',
                    }}
                  >
                    <motion.div
                      animate={{ x: isDark ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      style={{ position: 'absolute', top: 2, width: 22, height: 22, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}
                    >
                      {isDark ? <FiMoon size={11} color="#6366F1" /> : <FiSun size={11} color="#F59E0B" />}
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Danger zone */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '24px' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#EF4444', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiTrash2 size={16} /> Danger Zone
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="danger" onClick={handleDeleteAccount} icon={<FiTrash2 size={14} />}>
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </PageWrapper>
  );
};

export default Profile;

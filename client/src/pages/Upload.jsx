import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiUpload, FiChevronRight, FiZap, FiRefreshCw, FiCheck, FiTrash2 } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import PageWrapper from '../components/layout/PageWrapper';
import DropZone from '../components/upload/DropZone';
import FilePreview from '../components/upload/FilePreview';
import UploadProgress from '../components/upload/UploadProgress';
import Button from '../components/ui/Button';
import { uploadFiles, getUploadHistory, deleteUpload } from '../api/uploadApi';
import useToast from '../hooks/useToast';
import { formatDistanceToNow } from 'date-fns';
import Modal from '../components/ui/Modal';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const Upload = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [previewFile, setPreviewFile] = useState(null);

  const { data: historyData, isLoading: historyLoading, refetch } = useQuery({
    queryKey: ['uploadHistory'],
    queryFn: () => getUploadHistory(1, 20),
    retry: 1,
  });

  const existingUploads = historyData?.files || historyData?.uploads || historyData?.data || [];

  const handleFilesAccepted = useCallback((files) => {
    const newFiles = files.map((file) => ({
      file,
      id: `local-${Date.now()}-${Math.random()}`,
      status: 'pending',
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleRemovePending = (id) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) {
      toast.warning('No files to upload');
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    pendingFiles.forEach(({ file }) => formData.append('files', file));

    // Track per-file progress (simple simulation since multipart)
    const ids = pendingFiles.map((f) => f.id);
    const initialProgress = {};
    ids.forEach((id) => (initialProgress[id] = 0));
    setUploadProgress(initialProgress);

    try {
      const result = await uploadFiles(formData, (pct) => {
        const prog = {};
        ids.forEach((id) => (prog[id] = pct));
        setUploadProgress(prog);
      });

      const uploaded = result.files || result.data || [];
      setUploadedFiles((prev) => [...prev, ...uploaded]);
      setPendingFiles([]);
      setUploadProgress({});
      toast.success(`${uploaded.length} file(s) uploaded successfully!`);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
      const errProg = {};
      ids.forEach((id) => (errProg[id] = -1));
      setUploadProgress(errProg);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSelectUpload = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document? This cannot be undone.')) return;
    try {
      await deleteUpload(id);
      toast.success('Document deleted successfully');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete document');
    }
  };

  const handleGenerateFromSelected = () => {
    const ids = [...selectedIds];
    if (!ids.length) {
      toast.warning('Select at least one file to generate an itinerary');
      return;
    }
    navigate('/generate', { state: { fileIds: ids } });
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
            <span>Dashboard</span>
            <FiChevronRight size={12} />
            <span style={{ color: 'var(--text-primary)' }}>Upload Documents</span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: 4 }}>
            Upload Travel Documents
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
            Upload your flight tickets, hotel bookings, and travel documents for AI processing.
          </p>
        </motion.div>

        <div className="upload-grid">
          <div>
            {/* Drop Zone */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <DropZone onFilesAccepted={handleFilesAccepted} disabled={isUploading} />
            </motion.div>

            {/* Pending files */}
            <AnimatePresence>
              {pendingFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ marginTop: 20 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                      Files to Upload ({pendingFiles.length})
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPendingFiles([])}
                      icon={<FiTrash2 size={13} />}
                    >
                      Clear all
                    </Button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pendingFiles.map(({ file, id }) => (
                      <FilePreview
                        key={id}
                        file={file}
                        onRemove={isUploading ? null : () => handleRemovePending(id)}
                        status={
                          isUploading
                            ? uploadProgress[id] >= 100
                              ? 'completed'
                              : 'processing'
                            : 'pending'
                        }
                      />
                    ))}
                  </div>

                  {/* Upload progress bars */}
                  {isUploading && (
                    <div style={{ marginTop: 16 }}>
                      {pendingFiles.map(({ file, id }) => (
                        <UploadProgress key={id} fileName={file.name} progress={uploadProgress[id] || 0} />
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <Button
                      variant="primary"
                      size="lg"
                      isLoading={isUploading}
                      onClick={handleUpload}
                      icon={<FiUpload size={16} />}
                      fullWidth
                    >
                      {isUploading ? 'Uploading...' : `Upload ${pendingFiles.length} File${pendingFiles.length !== 1 ? 's' : ''}`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Successfully uploaded (session) */}
            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24 }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#10B981', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiCheck size={16} /> Just Uploaded
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {uploadedFiles.map((f) => (
                      <FilePreview
                        key={f._id || f.id}
                        file={{ name: f.originalName || f.filename || f.name, size: f.size || 0, type: f.mimetype || f.type }}
                        status="completed"
                        extractedText={f.extractedText}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel: existing uploads */}
          <div>
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: 18, padding: '20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0 }}>
                    My Documents
                  </h3>
                  <button onClick={() => refetch()} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                    <FiRefreshCw size={14} />
                  </button>
                </div>

                {historyLoading ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Loading...</p>
                ) : existingUploads.length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', fontFamily: "'Inter', sans-serif", padding: '20px 0' }}>
                    No documents yet
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 500, overflowY: 'auto', paddingRight: 4 }}>
                    {existingUploads.map((f) => {
                      const id = f._id || f.id;
                      const isSelected = selectedIds.has(id);
                      const fileType = f.fileType?.toUpperCase() || f.mimeType?.split('/')[1]?.toUpperCase() || 'DOC';
                      const fileSize = formatSize(f.size || 0);
                      const uploadTime = f.createdAt ? formatDistanceToNow(new Date(f.createdAt), { addSuffix: true }) : 'recently';
                      return (
                        <motion.div
                          key={id}
                          whileHover={{ y: -1 }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            padding: '12px 14px',
                            borderRadius: 14,
                            background: isSelected ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isSelected ? 'rgba(99,102,241,0.35)' : 'var(--border-color)'}`,
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            {/* Checkbox */}
                            <div
                              onClick={() => toggleSelectUpload(id)}
                              style={{
                                width: 18, height: 18, borderRadius: 5, border: `2px solid ${isSelected ? '#818CF8' : 'var(--text-tertiary)'}`,
                                background: isSelected ? '#6366F1' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s',
                                cursor: 'pointer', marginTop: 2,
                              }}
                            >
                              {isSelected && <FiCheck size={11} color="#fff" />}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                onClick={() => toggleSelectUpload(id)}
                                style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                              >
                                {f.originalName || f.filename || f.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                {fileType} • {fileSize}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                Uploaded {uploadTime}
                              </div>
                            </div>
                          </div>

                          {/* Options */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 2 }}>
                            <button
                              onClick={() => setPreviewFile(f)}
                              style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedIds.size > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Button variant="primary" fullWidth onClick={handleGenerateFromSelected} icon={<FiZap size={15} />}>
                    Generate from {selectedIds.size} file{selectedIds.size !== 1 ? 's' : ''}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      <Modal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        title={previewFile?.originalName || previewFile?.filename || 'Document Preview'}
        size="lg"
      >
        {previewFile && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
              <span>Type: {previewFile.fileType?.toUpperCase() || previewFile.mimeType?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}</span>
              <span>Size: {formatSize(previewFile.size || 0)}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>
              EXTRACTED TEXT CONTENT:
            </p>
            <pre style={{
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              padding: 16,
              borderRadius: 10,
              fontSize: '0.85rem',
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'pre-wrap',
              maxHeight: '50vh',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              margin: 0,
            }}>
              {previewFile.extractedText || 'No text extracted from this file.'}
            </pre>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default Upload;

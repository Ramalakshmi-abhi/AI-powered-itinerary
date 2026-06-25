import api from './axios';

export const uploadFiles = async (formData, onProgress) => {
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentage);
      }
    },
  });
  return response.data;
};

export const getUploadHistory = async (page = 1, limit = 20) => {
  const response = await api.get('/upload/history', { params: { page, limit } });
  return response.data;
};

export const getUpload = async (id) => {
  const response = await api.get(`/upload/${id}`);
  return response.data;
};

export const deleteUpload = async (id) => {
  const response = await api.delete(`/upload/${id}`);
  return response.data;
};

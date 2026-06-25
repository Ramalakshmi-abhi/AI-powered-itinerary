import api from './axios';

export const extractFromFile = async (fileId) => {
  const response = await api.post('/ai/extract', { fileId });
  return response.data;
};

export const generateItinerary = async (fileIds, title) => {
  const response = await api.post('/ai/generate', { fileIds, title });
  return response.data;
};

export const chatWithItinerary = async (itineraryId, message) => {
  const response = await api.post('/ai/chat', { itineraryId, message });
  return response.data;
};

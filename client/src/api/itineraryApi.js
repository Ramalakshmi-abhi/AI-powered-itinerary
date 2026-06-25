import api from './axios';

export const getItineraries = async (params = {}) => {
  const response = await api.get('/itinerary', { params });
  return response.data;
};

export const getItinerary = async (id) => {
  const response = await api.get(`/itinerary/${id}`);
  return response.data;
};

export const updateItinerary = async (id, data) => {
  const response = await api.put(`/itinerary/${id}`, data);
  return response.data;
};

export const deleteItinerary = async (id) => {
  const response = await api.delete(`/itinerary/${id}`);
  return response.data;
};

export const shareItinerary = async (id) => {
  const response = await api.post(`/itinerary/${id}/share`);
  return response.data;
};

export const getSharedItinerary = async (code) => {
  const response = await api.get(`/itinerary/share/${code}`);
  return response.data;
};

export const duplicateItinerary = async (id) => {
  const response = await api.post(`/itinerary/${id}/duplicate`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/user/dashboard');
  return response.data;
};

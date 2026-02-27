import API from './axiosInstance';

export const fetchShowrooms = () => API.get('/showroom');
export const getShowroomStats = (id) => API.get(`/showroom/${id}/stats`);
export const createShowroom = (data) => API.post('/showroom', data);
export const updateShowroom = (id, data) => API.put(`/showroom/${id}`, data);
export const deleteShowroom = (id) => API.delete(`/showroom/${id}`);

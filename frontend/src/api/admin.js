import API from './axiosInstance';

export const getAdminStats = () => API.get('/admin/stats');
export const fetchAllUsers = () => API.get('/admin/users');
export const createUserByAdmin = (data) => API.post('/admin/users', data);
export const updateUserByAdmin = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUserByAdmin = (id) => API.delete(`/admin/users/${id}`);
export const scrapePremiumCars = () => API.post('/admin/scrape-cars');

import API from './axiosInstance';

export const fetchAllCars = (params) => API.get('/cars', { params });
export const fetchCarById = (id) => API.get(`/cars/${id}`);
export const createCar = (data) => API.post('/cars', data);
export const updateCar = (id, data) => API.put(`/cars/${id}`, data);
export const removeCar = (id) => API.delete(`/cars/${id}`);

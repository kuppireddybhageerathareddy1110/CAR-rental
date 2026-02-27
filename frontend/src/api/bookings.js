import API from './axiosInstance';

export const bookCar = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getAllBookings = () => API.get('/bookings/all');
export const getShowroomBookings = () => API.get('/bookings/showroom');
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { bookingStatus: status });
export const cancelBooking = (id) => API.post(`/bookings/${id}/cancel`);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

import { bookCar as bookCarAPI, getMyBookings, getAllBookings, getShowroomBookings, cancelBooking as cancelBookingAPI, deleteBooking as deleteBookingAPI, updateBookingStatus } from '../../api/bookings';

export const bookCar = (data) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await bookCarAPI(data);
        dispatch({ type: 'ADD_BOOKING', payload: res.data.booking });
        alert('Car booked successfully!');
        window.location.href = `/invoice/${res.data.booking._id}`;
    } catch (err) {
        alert(err.response?.data?.message || 'Booking failed.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const fetchMyBookings = () => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await getMyBookings();
        dispatch({ type: 'GET_BOOKINGS', payload: res.data });
    } catch (err) {
        console.error(err);
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const fetchAllBookings = () => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await getAllBookings();
        dispatch({ type: 'GET_BOOKINGS', payload: res.data });
    } catch (err) {
        console.error(err);
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const fetchShowroomBookings = () => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await getShowroomBookings();
        dispatch({ type: 'GET_BOOKINGS', payload: res.data });
    } catch (err) {
        console.error(err);
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const cancelBooking = (bookingId) => async (dispatch) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    dispatch({ type: 'LOADING_START' });
    try {
        await cancelBookingAPI(bookingId);
        alert('Booking cancelled successfully!');
        dispatch(fetchMyBookings());
    } catch (err) {
        alert(err.response?.data?.message || 'Cancellation failed.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this booking record? This cannot be undone.')) return;
    dispatch({ type: 'LOADING_START' });
    try {
        await deleteBookingAPI(bookingId);
        alert('Booking record deleted successfully!');
        dispatch(fetchAllBookings());
    } catch (err) {
        alert(err.response?.data?.message || 'Deletion failed.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};
export const changeBookingStatus = (bookingId, status, type = 'all') => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        await updateBookingStatus(bookingId, status);
        alert('Booking status updated!');
        if (type === 'showroom') {
            dispatch(fetchShowroomBookings());
        } else {
            dispatch(fetchAllBookings());
        }
    } catch (err) {
        alert(err.response?.data?.message || 'Update failed.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

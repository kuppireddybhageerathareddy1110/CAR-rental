import { fetchAllCars, createCar, updateCar, removeCar } from '../../api/cars';

export const getAllCars = (params) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await fetchAllCars(params);
        dispatch({ type: 'GET_ALL_CARS', payload: res.data });
    } catch (err) {
        console.error(err);
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const addCar = (data) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await createCar(data);
        dispatch({ type: 'ADD_CAR', payload: res.data.car });
        alert('Car added successfully!');
        window.location.href = '/admin';
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to add car.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const editCar = (id, data) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await updateCar(id, data);
        dispatch({ type: 'UPDATE_CAR', payload: res.data.car });
        alert('Car updated successfully!');
        window.location.href = '/admin';
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to update car.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const deleteCar = (id) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        await removeCar(id);
        dispatch({ type: 'DELETE_CAR', payload: id });
        alert('Car deleted.');
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete car.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};
export const toggleCarMaintenance = (id, currentStatus) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const nextStatus = currentStatus === 'Healthy' ? 'Under Maintenance' : 'Healthy';
        const res = await updateCar(id, { maintenanceStatus: nextStatus });
        dispatch({ type: 'UPDATE_CAR', payload: res.data.car });
    } catch (err) {
        console.error(err);
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

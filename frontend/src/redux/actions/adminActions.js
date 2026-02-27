import { getAdminStats, fetchAllUsers, deleteUserByAdmin, updateUserByAdmin, createUserByAdmin, scrapePremiumCars } from '../../api/admin';

export const loadAdminStats = () => async (dispatch) => {
    try {
        const res = await getAdminStats();
        dispatch({ type: 'GET_ADMIN_STATS', payload: res.data });
    } catch (err) { console.error(err); }
};

export const loadAllUsers = () => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await fetchAllUsers();
        dispatch({ type: 'GET_ALL_USERS', payload: res.data });
    } catch (err) { console.error(err); }
    finally { dispatch({ type: 'LOADING_END' }); }
};

export const removeUser = (id) => async (dispatch) => {
    try {
        await deleteUserByAdmin(id);
        dispatch({ type: 'DELETE_USER', payload: id });
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete user.'); }
};

export const editUser = (id, data) => async (dispatch) => {
    try {
        const res = await updateUserByAdmin(id, data);
        dispatch({ type: 'UPDATE_USER', payload: res.data.user });
        alert('User updated.');
    } catch (err) { alert(err.response?.data?.message || 'Failed to update user.'); }
};

export const createAdminUser = (data) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        await createUserByAdmin(data);
        const res = await fetchAllUsers();
        dispatch({ type: 'GET_ALL_USERS', payload: res.data });
        alert('User created successfully!');
    } catch (err) { alert(err.response?.data?.message || 'Failed to create user.'); }
    finally { dispatch({ type: 'LOADING_END' }); }
};

export const scrapeCarsByAdmin = () => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await scrapePremiumCars();
        alert(res.data.message);
        const stats = await getAdminStats();
        dispatch({ type: 'GET_ADMIN_STATS', payload: stats.data });
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to scrape cars');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

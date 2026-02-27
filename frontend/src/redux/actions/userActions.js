import { loginUser, registerUser } from '../../api/auth';

export const userLogin = (values) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await loginUser(values);
        const { token, user } = res.data;
        localStorage.setItem('user', JSON.stringify({ ...user, token }));
        window.location.href = user.role === 'admin' ? '/admin' : user.role === 'showroom-admin' ? '/showroom' : '/';
    } catch (err) {
        alert(err.response?.data?.message || 'Login failed.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const userRegister = (values) => async (dispatch) => {
    dispatch({ type: 'LOADING_START' });
    try {
        const res = await registerUser(values);
        const { token, user } = res.data;
        localStorage.setItem('user', JSON.stringify({ ...user, token }));
        window.location.href = '/';
    } catch (err) {
        alert(err.response?.data?.message || 'Registration failed.');
    } finally {
        dispatch({ type: 'LOADING_END' });
    }
};

export const userLogout = () => () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// Alerts Reducer — manages loading and error states
const initialState = { loading: false, error: null };

const alertsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOADING_START': return { ...state, loading: true };
        case 'LOADING_END': return { ...state, loading: false };
        case 'SET_ERROR': return { ...state, error: action.payload };
        case 'CLEAR_ERROR': return { ...state, error: null };
        default: return state;
    }
};

export default alertsReducer;

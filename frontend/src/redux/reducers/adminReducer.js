const initialState = { users: [], stats: null };

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ADMIN_STATS': return { ...state, stats: action.payload };
        case 'GET_ALL_USERS': return { ...state, users: action.payload };
        case 'DELETE_USER': return { ...state, users: state.users.filter(u => u._id !== action.payload) };
        case 'UPDATE_USER':
            return { ...state, users: state.users.map(u => u._id === action.payload._id ? action.payload : u) };
        default: return state;
    }
};

export default adminReducer;

const initialState = { showrooms: [], stats: null };

const showroomReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_SHOWROOMS': return { ...state, showrooms: action.payload };
        case 'GET_SHOWROOM_STATS': return { ...state, stats: action.payload };
        case 'ADD_SHOWROOM': return { ...state, showrooms: [...state.showrooms, action.payload] };
        case 'UPDATE_SHOWROOM':
            return { ...state, showrooms: state.showrooms.map(s => s._id === action.payload._id ? action.payload : s) };
        case 'DELETE_SHOWROOM':
            return { ...state, showrooms: state.showrooms.filter(s => s._id !== action.payload) };
        default: return state;
    }
};

export default showroomReducer;

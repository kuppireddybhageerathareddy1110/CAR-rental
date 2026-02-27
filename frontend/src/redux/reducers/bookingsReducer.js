const initialState = { bookings: [] };

const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_BOOKINGS': return { ...state, bookings: action.payload };
        case 'ADD_BOOKING': return { ...state, bookings: [action.payload, ...state.bookings] };
        default: return state;
    }
};

export default bookingsReducer;

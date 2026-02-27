const initialState = { cars: [] };

const carsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALL_CARS': return { ...state, cars: action.payload };
        case 'ADD_CAR': return { ...state, cars: [...state.cars, action.payload] };
        case 'UPDATE_CAR':
            return { ...state, cars: state.cars.map(c => c._id === action.payload._id ? action.payload : c) };
        case 'DELETE_CAR':
            return { ...state, cars: state.cars.filter(c => c._id !== action.payload) };
        default: return state;
    }
};

export default carsReducer;

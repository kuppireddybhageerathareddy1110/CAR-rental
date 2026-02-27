import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import alertsReducer from './reducers/alertsReducer';
import carsReducer from './reducers/carsReducer';
import bookingsReducer from './reducers/bookingsReducer';
import adminReducer from './reducers/adminReducer';
import showroomReducer from './reducers/showroomReducer';

const rootReducer = combineReducers({
    alertsReducer,
    carsReducer,
    bookingsReducer,
    adminReducer,
    showroomReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;

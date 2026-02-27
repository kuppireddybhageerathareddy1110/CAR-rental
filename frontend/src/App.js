import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// Route guards
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User pages
import Home from './pages/user/Home';
import BookingCar from './pages/user/BookingCar';
import UserBookings from './pages/user/UserBookings';
import Showrooms from './pages/user/Showrooms';
import Profile from './pages/user/Profile';
import Invoice from './pages/user/Invoice';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import ShowroomManage from './pages/admin/ShowroomManage';
import AddCar from './pages/admin/AddCar';
import EditCar from './pages/admin/EditCar';

// Showroom-admin pages
import ShowroomDashboard from './pages/showroom/ShowroomDashboard';
import ShowroomCars from './pages/showroom/ShowroomCars';
import ShowroomBookings from './pages/showroom/ShowroomBookings';
import ShowroomProfile from './pages/showroom/ShowroomProfile';
import CarAvailability from './pages/showroom/CarAvailability';
import CustomerDetail from './pages/showroom/CustomerDetail';
import MaintenanceHistory from './pages/showroom/MaintenanceHistory';

import 'antd/dist/antd.css';
import './styles/index.css';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    {/* Public routes */}
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />

                    {/* User routes */}
                    <RoleRoute path="/" exact component={Home} roles={['user', 'admin', 'showroom-admin']} />
                    <RoleRoute path="/booking/:carid" exact component={BookingCar} roles={['user']} />
                    <RoleRoute path="/my-bookings" exact component={UserBookings} roles={['user']} />
                    <RoleRoute path="/showrooms" exact component={Showrooms} roles={['user', 'admin', 'showroom-admin']} />
                    <RoleRoute path="/profile" exact component={Profile} roles={['user', 'admin', 'showroom-admin']} />
                    <RoleRoute path="/invoice/:id" exact component={Invoice} roles={['user', 'admin', 'showroom-admin']} />

                    {/* Admin routes */}
                    <RoleRoute path="/admin" exact component={AdminDashboard} roles={['admin']} />
                    <RoleRoute path="/admin/cars" exact component={AdminCars} roles={['admin']} />
                    <RoleRoute path="/admin/bookings" exact component={AdminBookings} roles={['admin']} />
                    <RoleRoute path="/admin/users" exact component={AdminUsers} roles={['admin']} />
                    <RoleRoute path="/admin/showrooms" exact component={ShowroomManage} roles={['admin']} />
                    <RoleRoute path="/admin/addcar" exact component={AddCar} roles={['admin']} />
                    <RoleRoute path="/admin/editcar/:carid" exact component={EditCar} roles={['admin']} />

                    {/* Showroom-admin routes */}
                    <RoleRoute path="/showroom" exact component={ShowroomDashboard} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/cars" exact component={ShowroomCars} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/bookings" exact component={ShowroomBookings} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/profile" exact component={ShowroomProfile} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/availability/:carid" exact component={CarAvailability} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/customer/:userid" exact component={CustomerDetail} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/maintenance/:carid" exact component={MaintenanceHistory} roles={['showroom-admin']} />
                    <RoleRoute path="/showroom/addcar" exact component={AddCar} roles={['showroom-admin', 'admin']} />
                    <RoleRoute path="/showroom/editcar/:carid" exact component={EditCar} roles={['showroom-admin', 'admin']} />

                    {/* Fallback */}
                    <Redirect to="/login" />
                </Switch>
            </BrowserRouter>
        </Provider>
    );
}

export default App;

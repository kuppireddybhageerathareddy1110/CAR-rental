import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * RoleRoute — protects route by role array.
 * Usage: <RoleRoute roles={['admin']} path="/admin" component={AdminDashboard} />
 */
function RoleRoute({ component: Component, roles, ...rest }) {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!user) return <Redirect to="/login" />;
                if (!roles.includes(user.role)) {
                    // Redirect based on actual role
                    if (user.role === 'admin') return <Redirect to="/admin" />;
                    if (user.role === 'showroom-admin') return <Redirect to="/showroom" />;
                    return <Redirect to="/" />;
                }
                return <Component {...props} />;
            }}
        />
    );
}

export default RoleRoute;

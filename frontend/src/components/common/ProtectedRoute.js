import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Redirects to /login if no user is stored
function ProtectedRoute({ component: Component, ...rest }) {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <Route
            {...rest}
            render={(props) =>
                user ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
}

export default ProtectedRoute;

//erc/services/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // store JWT or session in localStorage
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PrivateRoute;
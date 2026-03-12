//erc/services/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
const PrivateRoute = ({ children }) => {
    const token = getToken(); // store JWT or session in localStorage
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PrivateRoute;
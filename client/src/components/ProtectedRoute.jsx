import React from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if(token){
   return <Outlet />
  }
  else{
    return <Navigate to="/" replace />
  }

};

export default ProtectedRoute;
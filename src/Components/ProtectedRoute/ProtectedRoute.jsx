import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProtectedRoute(props) {
  const access_token = Cookies.get('access_token');

  if (access_token !== undefined) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}
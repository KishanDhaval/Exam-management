// src/components/routing/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthContext()

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === 'teacher' ? '/dashboard/teacher' :
      user.role === 'student' ? '/dashboard/student' :
      '/login';

    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;

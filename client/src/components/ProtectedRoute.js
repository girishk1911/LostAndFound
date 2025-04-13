import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiresGuard = false }) => {
  const { user, loading, isAuthenticated, isGuard } = useContext(AuthContext);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // If route requires guard role, check user role
  if (requiresGuard && !isGuard()) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated (and has required role if specified)
  return children;
};

export default ProtectedRoute;
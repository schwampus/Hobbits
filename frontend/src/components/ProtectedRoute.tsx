import {Navigate} from 'react-router-dom';
import type {ReactNode} from 'react';

const ProtectedRoute = ({children }: {children: ReactNode}) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
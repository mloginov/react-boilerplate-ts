import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from './auth/auth-context';

export interface ProtectedRouteProps {
  redirectPath?: string;
  children?: string | React.JSX.Element | React.JSX.Element[];
}

const ProtectedRoute = ({ redirectPath = '/login', children }: ProtectedRouteProps) => {
  const { isAuth } = useContext(AuthContext);
  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;

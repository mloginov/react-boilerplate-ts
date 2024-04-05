import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from './auth/auth-context';

export interface IProtectedRouteProps {
  redirectPath?: string;
  children?: string | React.JSX.Element | React.JSX.Element[];
}

const ProtectedRoute = ({ redirectPath = '/login', children }: IProtectedRouteProps) => {
  const { isAuth } = useContext(AuthContext);
  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;

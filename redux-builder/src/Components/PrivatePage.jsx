import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivatePage = ({ children }) => {
  const { isAuth } = useSelector((state) => state.Auth);
  return isAuth ? children : <Navigate to="/signIn" />;
};

export default PrivatePage;

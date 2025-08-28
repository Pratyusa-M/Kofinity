/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Route, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ path, element }) => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;

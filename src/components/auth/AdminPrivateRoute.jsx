
import { Route, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ path, element }) => {
  const isAuthenticated = localStorage.getItem("admin-token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default PrivateRoute;

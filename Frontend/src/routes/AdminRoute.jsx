import { Navigate, Outlet } from "react-router-dom";
import { getToken, isAdmin } from "@/utils/auth";
import { useEffect } from "react";

const AdminRoute = () => {
  const token = getToken();

  

  if (!token) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoute;
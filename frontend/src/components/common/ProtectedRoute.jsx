// src/components/common/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);

  // Outlet renders the matched child route
  // If no user → redirect to login, replace so they can't click "back" to it
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

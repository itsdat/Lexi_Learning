import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-6">⏳ Đang tải...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
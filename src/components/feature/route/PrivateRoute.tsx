import BaseLoading from "@/components/common/loading/BaseLoading";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <BaseLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

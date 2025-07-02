import { useAuth } from "@/lib/hooks/use-auth";
import { Navigate, Outlet } from "react-router";

function AdminOutlet() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <Navigate to="/" />

  return <Outlet />;
}

export default AdminOutlet;
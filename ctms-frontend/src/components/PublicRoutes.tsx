import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../libs/hook/useAuth";

const PublicRoutes = (props: any) => {
  const { auth } = useAuth();

  return auth ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;

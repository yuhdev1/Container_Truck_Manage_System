import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../libs/hook/useAuth";

type ProtectedRouteType = {
  roleRequired?: string[];
};

const ProtectedRoutes = (props: ProtectedRouteType) => {
  const { auth, role } = useAuth();

  //if the role required is there or not
  if (props.roleRequired) {
    return auth ? (
      props.roleRequired.includes(role) ? (
        <Outlet />
      ) : (
        <Navigate to="/denied" />
      )
    ) : (
      <Navigate to="/signin" />
    );
  } else {
    return auth ? <Outlet /> : <Navigate to="/signin" />;
  }
};

export default ProtectedRoutes;

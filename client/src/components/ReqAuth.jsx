import { Outlet, useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ReqAuth = ({allowedRoles}) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth,allowedRoles)
  return    auth?.roles?.find(role => allowedRoles?.includes(role))? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="./unAuthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="./" state={{ from: location }} replace />
  );
};

export default ReqAuth;

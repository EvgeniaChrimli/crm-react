import { selectUser } from "src/entities/user/model/selector";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";
import { ROUTES } from "src/shared/config/routes";

export function RootRedirect() {
  const user = useAppSelector(selectUser);

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Navigate to={user.role === "admin" ? ROUTES.admin : ROUTES.app} />;
}

import type React from "react";
import type { Role } from "src/entities/user/model/user-types";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "src/entities/user/model/selector";
import { ROUTES } from "src/shared/config/routes";
import { Navigate } from "react-router-dom";

interface Props {
  role: Role;
  children: React.ReactNode;
}
export function RequireRole({ role, children }: Props) {
  const user = useAppSelector(selectUser);

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

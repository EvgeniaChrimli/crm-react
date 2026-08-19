import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootRedirect } from "./app/router/root-redirect";
import { ROUTES } from "./shared/config/routes";
import LoginPage from "./pages/login-page";
import LogOutPage from "./pages/logout-page";
import { RequireRole } from "./app/router/require-role";
import AdminLauyot from "./app/layouts/admin-lauyot";
import UserLayout from "./app/layouts/user-lauyot";
import NotFoundPage from "./pages/not-found-page";
import { Provider } from "react-redux";
import { store } from "./app/store/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.logout,
    element: <LogOutPage />,
  },
  {
    path: ROUTES.admin,
    element: (
      <RequireRole role="admin">
        <AdminLauyot />
      </RequireRole>
    ),
    children: [],
  },
  {
    path: ROUTES.app,
    element: (
      <RequireRole role="user">
        <UserLayout />
      </RequireRole>
    ),
    children: [],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);

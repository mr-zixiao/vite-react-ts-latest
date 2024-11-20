import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lazy from "@/router/Lazy.tsx";
import AuthGuard from "@/router/AuthGuard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard>{Lazy(() => import("@/pages/Home/index"))}</AuthGuard>,
  },
  {
    path: "/login",
    element: Lazy(() => import("@/pages/Login/index")),
  },
  {
    path: "*",
    element: Lazy(() => import("@/pages/Error/NotFound")),
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;

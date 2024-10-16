import ExercisesPage from "@/pages/exercises";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutes } from "../constants/app-routes";
import { useLoadSession } from "../hooks/use-load-session";

const router = createBrowserRouter([
  { path: AppRoutes.ROOT, element: <LoginPage /> },
  { path: AppRoutes.LOGIN, element: <LoginPage /> },
  { path: AppRoutes.REGISTER, element: <RegisterPage /> },
  { path: AppRoutes.EXERCISES, element: <ExercisesPage /> },
]);

export default function AppRouterProvider() {
   useLoadSession();

  return <RouterProvider router={router} />;
}

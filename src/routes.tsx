import { Navigate, RouteObject } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import RegisterPage from "./pages/register-page";
import AppLayout from "./layouts/AppLayout";
import InitialBillPage from "./pages/initial-bill-page";
import SplashPage from "./pages/splash-page";
import FinalBillPage from "./pages/final-bill-page";
import SearchPage from "./pages/search-page";
import SettingsPage from "./pages/settings-page";
import HomePage from "./pages/home-page";

const Routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <SplashPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "app",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/home" replace />,
          },
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "initial-bill/:service",
            element: <InitialBillPage />,
          },
          {
            path: "initial-bill/:service/confirm",
            element: <InitialBillPage />,
          },
          {
            path: "final-bill",
            element: <FinalBillPage />,
          },
          {
            path: "search",
            element: <SearchPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
];

export default Routes;

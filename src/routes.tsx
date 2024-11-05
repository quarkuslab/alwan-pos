import { RouteObject } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import RegisterPage from "./pages/register-page";
import AppLayout from "./layouts/AppLayout";
import InitialBillPage from "./pages/initial-bill-page";
import SplashPage from "./pages/splash-page";
import FinalBillPage from "./pages/final-bill-page";

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
        ],
      },
    ],
  },
];

export default Routes;

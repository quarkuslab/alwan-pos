import { RouteObject } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import InitialPage from "./pages/initial-page";
import RegisterPage from "./pages/register-page";
import AppLayout from "./layouts/AppLayout";

const Routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <InitialPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "app",
        element: <AppLayout />,
      },
    ],
  },
];

export default Routes;

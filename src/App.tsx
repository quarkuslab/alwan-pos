import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./routes";
import TimeProvider from "./providers/TimeProvider";
import AuthProvider from "./providers/AuthProvider";

export default function App() {
  return (
    <TimeProvider>
      <AuthProvider>
        <RouterProvider router={createBrowserRouter(Routes)} />
      </AuthProvider>
    </TimeProvider>
  );
}

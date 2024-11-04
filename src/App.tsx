import { createHashRouter, RouterProvider } from "react-router-dom";
import Routes from "./routes";
import TimeProvider from "./providers/TimeProvider";
import OperationsProvider from "./providers/OperationsProvider";
import SystemProvider from "./providers/SystemProvider";
import { Fragment } from "react/jsx-runtime";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <Fragment>
      <Toaster />
      <TimeProvider>
        <SystemProvider>
          <OperationsProvider>
            <RouterProvider router={createHashRouter(Routes)} />
          </OperationsProvider>
        </SystemProvider>
      </TimeProvider>
    </Fragment>
  );
}

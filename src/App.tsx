import { createHashRouter, RouterProvider } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
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
            <NuqsAdapter>
              <RouterProvider router={createHashRouter(Routes)} />
            </NuqsAdapter>
          </OperationsProvider>
        </SystemProvider>
      </TimeProvider>
    </Fragment>
  );
}

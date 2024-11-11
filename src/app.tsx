import { createHashRouter, RouterProvider } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import Routes from "./routes";
import TimeProvider from "./providers/TimeProvider";
import OperationsProvider from "./providers/OperationsProvider";
import SystemProvider from "./providers/SystemProvider";
import { Fragment } from "react/jsx-runtime";
import { Toaster } from "./components/ui/toaster";
import AnalyticsProvider from "./providers/AnalyticsProvider";

// Root App
export default function App() {
  return (
    <Fragment>
      <Toaster />
      <TimeProvider>
        <SystemProvider>
          <AnalyticsProvider>
            <OperationsProvider>
              <NuqsAdapter>
                <RouterProvider router={createHashRouter(Routes)} />
              </NuqsAdapter>
            </OperationsProvider>
          </AnalyticsProvider>
        </SystemProvider>
      </TimeProvider>
    </Fragment>
  );
}

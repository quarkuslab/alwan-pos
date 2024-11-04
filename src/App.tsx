import { createHashRouter, RouterProvider } from "react-router-dom";
import Routes from "./routes";
import TimeProvider from "./providers/TimeProvider";
import CounterProvider from "./providers/CounterProvider";

export default function App() {
  return (
    <TimeProvider>
      <CounterProvider>
        <RouterProvider router={createHashRouter(Routes)} />
      </CounterProvider>
    </TimeProvider>
  );
}

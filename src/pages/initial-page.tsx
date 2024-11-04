import Spinner from "@/components/ui/spinner";
import { useCounterState } from "@/hooks/useCounter";
import { Navigate } from "react-router";

export default function InitialPage() {
  const counter = useCounterState();

  if (counter.status == "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size={30} />
      </div>
    );
  }
  if (counter.status == "not-registered") {
    return <Navigate to="/register" />;
  }
  if (counter.status == "loaded") {
    return <Navigate to="/app" />;
  }
}

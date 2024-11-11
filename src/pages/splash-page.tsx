import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useSystemState } from "@/hooks/useSystem";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";

export default function SplashPage() {
  const system = useSystemState();

  if (system.status == "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size={30} />
      </div>
    );
  }
  if (system.status == "failed") {
    return (
      <div className="h-screen flex flex-col space-y-5 items-center justify-center">
        <div>{system.message}</div>
        <Button asChild>
          <Link to="/register" replace>
            Reset Counter
          </Link>
        </Button>
      </div>
    );
  }
  if (system.status == "not-registered") {
    return <Navigate to="/register" replace />;
  }
  if (system.status == "loaded") {
    return <Navigate to="/app" replace />;
  }
}

import Spinner from "@/components/ui/spinner";
import { useAuthState } from "@/hooks/useAuth";
import { Navigate } from "react-router";

export default function InitialPage() {
  const auth = useAuthState();
  if (auth.status == "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size={30} />
      </div>
    );
  }
  if (auth.status == "not-registered") {
    return <Navigate to="/register" />;
  }
  if (auth.status == "authenticated") {
    return <Navigate to="/app" />;
  }
}

import { AuthContext, AuthState } from "@/contexts/auth";
import useOnMount from "@/hooks/useOnMount";
import CounterService from "@/services/counter.service";
import SettingsService from "@/services/settings.service";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  const register: AuthContext["register"] = useCallback(async (data) => {
    const token = await CounterService.register(data);
    await SettingsService.setToken(token);
    setState({
      status: "authenticated",
      token: token,
      counter: data,
    });
  }, []);

  useOnMount(async () => {
    const token = await SettingsService.getToken();
    if (!token) {
      setState({ status: "not-registered" });
    } else {
      const counter = await CounterService.getDetails(token);
      setState({
        status: "authenticated",
        token,
        counter,
      });
    }
  });

  return (
    <AuthContext.Provider
      value={{
        state,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

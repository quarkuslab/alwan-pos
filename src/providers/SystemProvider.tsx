import {
  SystemContext,
  SystemContextType,
  SystemState,
} from "@/contexts/system.context";
import useOnMount from "@/hooks/useOnMount";
import SettingsService from "@/services/settings.service";
import { SystemService } from "@/services/system.service";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function SystemProvider({ children }: Props) {
  const [state, setState] = useState<SystemState>({ status: "loading" });

  const register: SystemContextType["register"] = useCallback(async (data) => {
    const { token, counter } = await SystemService.register(data);
    const services = await SystemService.getServices(token);
    await SettingsService.setToken(token);
    setState({
      status: "loaded",
      token: token,
      counter: counter,
      services,
    });
  }, []);

  useOnMount(async () => {
    const token = await SettingsService.getToken();
    if (!token) {
      setState({ status: "not-registered" });
    } else {
      try {
        const counter = await SystemService.getDetails(token);
        const services = await SystemService.getServices(token);
        setState({
          status: "loaded",
          token,
          counter,
          services,
        });
      } catch (e) {
        setState({ status: "failed", message: String(e) });
      }
    }
  });

  return (
    <SystemContext.Provider
      value={{
        state,
        register,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

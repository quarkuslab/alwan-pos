import {
  SystemContext,
  SystemContextType,
  SystemState,
} from "@/contexts/system.context";
import { useAsyncToast } from "@/hooks/useAsyncToast";
import useOnMount from "@/hooks/useOnMount";
import SettingsService from "@/services/settings.service";
import { SystemService } from "@/services/system.service";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function SystemProvider({ children }: Props) {
  const [state, setState] = useState<SystemState>({ status: "loading" });
  const toast = useAsyncToast();

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

  const updateContactInfo: SystemContextType["updateContactInfo"] = useCallback(
    async (info) => {
      if (state.status == "loaded") {
        const promise = SystemService.updateDetails(state.token, {
          contactInfo: info,
        });
        toast({
          promise,
          loading: "Updating contact info...",
          success: "Updated contact info successfully",
          error: () => "Failed to update contact info",
        });
        const updatedCounter = await promise;
        setState({
          ...state,
          counter: updatedCounter,
        });
      }
    },
    [state, toast]
  );

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
        updateContactInfo,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

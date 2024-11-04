import {
  CounterContext,
  CounterContextType,
  CounterState,
} from "@/contexts/counter.context";
import useOnMount from "@/hooks/useOnMount";
import CounterService from "@/services/counter.service";
import SettingsService from "@/services/settings.service";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function CounterProvider({ children }: Props) {
  const [state, setState] = useState<CounterState>({ status: "loading" });

  const register: CounterContextType["register"] = useCallback(async (data) => {
    const { token, counter } = await CounterService.register(data);
    const services = await CounterService.getServices(token);
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
      const counter = await CounterService.getDetails(token);
      const services = await CounterService.getServices(token);
      setState({
        status: "loaded",
        token,
        counter,
        services,
      });
    }
  });

  return (
    <CounterContext.Provider
      value={{
        state,
        register,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
}

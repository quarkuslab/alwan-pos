import { Service, SystemCounter, SystemRegisterData } from "@/types/system";
import { createContext } from "react";

export type SystemState =
  | {
      status: "loading";
    }
  | {
      status: "not-registered";
    }
  | {
      status: "failed";
      message: string;
    }
  | {
      status: "loaded";
      token: string;
      counter: SystemCounter;
      services: Service[];
    };

export type SystemContextType = {
  state: SystemState;
  register: (data: SystemRegisterData) => Promise<void>;
  updateContactInfo: (info: string) => Promise<void>;
};

export const SystemContext = createContext<SystemContextType>({
  state: { status: "loading" },
  register: async () => {},
  updateContactInfo: async () => {},
});

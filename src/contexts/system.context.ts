import { SystemCounter, SystemRegisterData, SystemService } from "@/services/system.service"
import { createContext } from "react"

export type SystemState = {
  status: 'loading'
} | {
  status: 'not-registered'
} | {
  status: 'failed',
  message: string
} | {
  status: 'loaded'
  token: string
  counter: SystemCounter
  services: SystemService[]
}

export type SystemContextType = {
  state: SystemState
  register: (data: SystemRegisterData) => Promise<void>
}

export const SystemContext = createContext<SystemContextType>({ state: { status: 'loading' }, register: async () => { } })
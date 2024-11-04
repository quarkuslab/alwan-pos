import { CounterData, CounterService } from "@/services/counter.service"
import { createContext } from "react"

export type CounterState = {
  status: 'loading'
} | {
  status: 'not-registered'
} | {
  status: 'loaded'
  token: string
  counter: CounterData
  services: CounterService[]
}

export type CounterContextType = {
  state: CounterState
  register: (data: { name: string; contactNumber: string }) => Promise<void>
}

export const CounterContext = createContext<CounterContextType>({ state: { status: 'loading' }, register: async () => { } })
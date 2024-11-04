import { CounterContext } from "@/contexts/counter.context";
import { useContext } from "react";

export function useCounterState() {
  const value = useContext(CounterContext)
  return value.state
}

export function useCounterRegister() {
  const value = useContext(CounterContext)
  return value.register
}
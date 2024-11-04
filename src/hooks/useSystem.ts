import { SystemContext } from "@/contexts/system.context";
import { useContext } from "react";

export function useSystemState() {
  const value = useContext(SystemContext)
  return value.state
}

export function useSystemRegister() {
  const value = useContext(SystemContext)
  return value.register
}
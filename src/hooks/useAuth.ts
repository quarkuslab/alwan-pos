import { AuthContext } from "@/contexts/auth";
import { useContext } from "react";

export function useAuthState() {
  const value = useContext(AuthContext)
  return value.state
}

export function useAuthRegister() {
  const value = useContext(AuthContext)
  return value.register
}
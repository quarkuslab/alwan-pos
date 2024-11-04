import { createContext } from "react"

export type AuthState = {
  status: 'loading'
} | {
  status: 'not-registered'
} | {
  status: 'authenticated'
  token: string
  counter: {
    name: string
    contactNumber: string
  }
}

export type AuthContext = {
  state: AuthState
  register: (data: { name: string; contactNumber: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContext>({ state: { status: 'loading' }, register: async () => { } })
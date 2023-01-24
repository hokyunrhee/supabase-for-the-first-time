import { supabase } from "@/utils/supabase"
import React, { createContext, useContext, useEffect, useState } from "react"

type User = Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]
type State = { user: User; isLoading: boolean }

const context = createContext<State | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      const { data } = res
      const { user } = data

      setUser(user)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then((res) => {
        const { data } = res
        const { user } = data

        setUser(user)
      })
    })
  }, [])

  return <context.Provider value={{ user, isLoading }}>{children}</context.Provider>
}

export const useUser = () => {
  const state = useContext(context)

  if (!state) throw new Error("cannot find user provider")

  return state
}

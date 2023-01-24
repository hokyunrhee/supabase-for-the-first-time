import React, { createContext, useContext, useEffect, useState } from "react"

import { Database } from "@/types/database"
import { supabase } from "@/utils/supabase"

type User = Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]
type Profile = Database["public"]["Tables"]["profile"]["Row"] | null
type State = { user: User; profile: Profile; isLoading: boolean }

const context = createContext<State | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [profile, setProfile] = useState<Profile>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      const { user } = data
      const { data: profile } = await supabase.from("profile").select("*").eq("id", user?.id).single()

      setProfile(profile)
      setUser(user)
      setIsLoading(false)
    }

    getUser()

    supabase.auth.onAuthStateChange(() => {
      getUser()
    })
  }, [])

  return <context.Provider value={{ user, profile, isLoading }}>{children}</context.Provider>
}

export const useUser = () => {
  const state = useContext(context)

  if (!state) throw new Error("cannot find user provider")

  return state
}

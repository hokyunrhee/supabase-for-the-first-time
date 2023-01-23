import { useQuery, useQueryClient } from "@tanstack/react-query"
import NextLink from "next/link"

import { supabase } from "@/utils/supabase"
import { useRouter } from "next/router"

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  )
}

export default AppLayout

const Navbar = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data, isLoading } = useQuery(["session"], async () => {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return data.session
  })

  const logout = async () => {
    await supabase.auth.signOut()
    queryClient.invalidateQueries(["session"])
    router.replace("/")
  }

  const renderButton = () => {
    return data ? <button onClick={logout}>logout</button> : <NextLink href={"/login"}>login</NextLink>
  }

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <NextLink href="/" className="btn-ghost btn text-xl normal-case">
          SaaS
        </NextLink>
      </div>
      <div className="flex-none gap-2">
        {isLoading ? <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" /> : renderButton()}
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-300 p-4 text-base-content">
      <div>
        <p>Copyright © 2023 - All right reserved by ACME Industries Ltd</p>
      </div>
    </footer>
  )
}

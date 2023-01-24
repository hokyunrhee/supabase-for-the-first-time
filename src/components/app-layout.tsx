import NextLink from "next/link"
import { useRouter } from "next/router"

import { supabase } from "@/utils/supabase"
import { useUser } from "@/contexts/user"

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
  const router = useRouter()
  const { user, isLoading } = useUser()

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace("/")
  }

  const renderButton = () => {
    return user ? <button onClick={logout}>logout</button> : <NextLink href={"/login"}>login</NextLink>
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

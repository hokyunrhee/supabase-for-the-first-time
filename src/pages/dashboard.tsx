import { GetServerSideProps } from "next"
import { supabaseAdmin } from "@/utils/supabase-admin"
import { useUser } from "@/contexts/user"

const Dashboard = () => {
  const { user } = useUser()

  return <div>Dashboard</div>
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  const token = req.cookies["sb-access-token"]

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token)

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: {},
    }
  }

  return {
    props: {},
  }
}

import { InferGetStaticPropsType, GetStaticProps } from "next"
import NextLink from "next/link"

import { supabase } from "@/utils/supabase"
import { Database } from "@/types/database"

type Lesson = Database["public"]["Tables"]["lesson"]["Row"]

const Home = ({ lessons }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {lessons.map(({ id, title }) => (
        <NextLink key={id} href={`/${id}`}>
          {title}
        </NextLink>
      ))}
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps<{ lessons: Lesson[] }> = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*")

  return {
    props: {
      lessons: lessons as Lesson[],
    },
  }
}

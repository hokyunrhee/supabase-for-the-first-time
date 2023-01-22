import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import { ParsedUrlQuery } from "querystring"

import { supabase } from "@/utils/supabase"
import { Database } from "@/types/database"

type Lesson = Database["public"]["Tables"]["lesson"]["Row"]
interface Params extends ParsedUrlQuery {
  id: string
}

const LessonId = ({ lesson }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <div>{lesson.title}</div>
}

export default LessonId

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: lessons } = await supabase.from("lesson").select("id")

  const paths = (lessons || []).map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{ lesson: Lesson }, Params> = async ({ params }) => {
  const { id } = params as Params
  const { data: lesson } = await supabase.from("lesson").select("*").eq("id", id).single()

  return {
    props: {
      lesson: lesson as Lesson,
    },
  }
}

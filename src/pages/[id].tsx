import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import VideoComponent from "react-player"

import { supabase } from "@/utils/supabase"
import { Database } from "@/types/database"

type Lesson = Database["public"]["Tables"]["lesson"]["Row"]
interface Params extends ParsedUrlQuery {
  id: string
}

const LessonId = ({ lesson }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    const getPremiumContent = async () => {
      const { data } = await supabase.from("premium_content").select("*").eq("id", lesson.id).single()

      setVideoUrl(data ? data.video_url : null)
    }

    getPremiumContent()
  }, [lesson.id])

  return (
    <div>
      <div>{lesson.title}</div>
      {!!videoUrl && <VideoComponent url={videoUrl} width="100%" />}
    </div>
  )
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

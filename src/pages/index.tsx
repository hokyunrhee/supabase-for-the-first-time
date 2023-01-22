import { InferGetStaticPropsType, GetStaticProps } from "next"

import { getLessons } from "@/apis/getLessons"

type LessonsResponse = Awaited<ReturnType<typeof getLessons>>
type Lessons = NonNullable<LessonsResponse["data"]>

const Home = ({ lessons }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {lessons.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps<{ lessons: Lessons }> = async () => {
  const { data: lessons, error } = await getLessons()

  if (error) {
    console.log(error)

    return {
      props: {
        lessons: [],
      },
    }
  }

  return {
    props: {
      lessons,
    },
  }
}

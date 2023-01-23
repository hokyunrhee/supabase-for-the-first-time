import { useRef, useState } from "react"

import { supabase } from "@/utils/supabase"
import { useMutation } from "@tanstack/react-query"

const emailRedirectTo = process.env.NEXT_PUBLIC_APP_URL

if (!emailRedirectTo) throw new Error("Missing App URL")

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null)

  const {
    mutate: handleClick,
    isLoading,
    isSuccess,
  } = useMutation(async (event: React.FormEvent) => {
    event.preventDefault()
    if (!emailRef.current) return

    const email = emailRef.current.value

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
      },
    })
  })

  return (
    <div className="flex justify-center py-12">
      <div className="flex max-w-md flex-1 flex-col justify-center space-y-5">
        <div className="mt-12 flex flex-col space-y-2 text-center">
          <h2 className="text-3xl font-bold">Log in to Simple SaaS</h2>
        </div>
        {isLoading && <div>로그인 링크 보내는중</div>}
        {isSuccess && <div>이메일로 전송된 로그인 링크를 확인하세요</div>}
        <form className="flex max-w-md flex-col space-y-5" onSubmit={handleClick}>
          <input
            type="text"
            placeholder="Email address"
            name="email"
            className="flex rounded-lg border-2 border-black px-3 py-2 font-medium placeholder:font-normal"
            ref={emailRef}
          />
          <button
            type="submit"
            className="flex flex-none items-center justify-center rounded-lg border-2 border-black bg-black px-3 py-2 font-medium text-white"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

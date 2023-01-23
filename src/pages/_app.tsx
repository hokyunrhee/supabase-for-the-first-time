import "../styles/globals.css"
import type { AppProps } from "next/app"
import AppLayout from "@/components/app-layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

if (process.env.NODE_ENV === "development") {
  if (typeof window !== "undefined") {
    const { worker } = require("../mocks/browser")
    worker.start()
  }
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp

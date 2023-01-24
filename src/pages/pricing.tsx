import NextLink from "next/link"
import { InferGetStaticPropsType } from "next"
import Stripe from "stripe"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"

import { useUser } from "@/contexts/user"
import { supabase } from "@/utils/supabase"

const NEXT_PUBLIC_STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY

if (!NEXT_PUBLIC_STRIPE_KEY) throw new Error("Stripe public key not found")

const Pricing = ({ plans }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { user, profile, isLoading } = useUser()

  const showSubscribeButton = !!profile && !profile.is_subscribed
  const showCreateAccountButton = !user
  const showManageSubscriptionButton = !!profile && profile.is_subscribed

  const handleSubscribe = async (planId: string) => {
    if (!user) return

    const { data } = await axios.get(`/api/subscription/${planId}`)
    const stripe = await loadStripe(NEXT_PUBLIC_STRIPE_KEY)

    if (!stripe) return

    await stripe.redirectToCheckout({ sessionId: data.id })
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl justify-around py-16">
      {plans.map((plan) => (
        <div key={plan.id} className="h-40 w-80 rounded px-6 py-4 shadow">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            {plan.price / 100} / {plan.interval}
          </p>
          <div>
            {!isLoading && (
              <div>
                {showSubscribeButton && <button onClick={() => handleSubscribe(plan.id)}>Subscribe</button>}
                {showCreateAccountButton && <NextLink href="/login">Create Account</NextLink>}
                {showManageSubscriptionButton && <NextLink href="/dashboard">Manage Subscription</NextLink>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Pricing

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export const getStaticProps = async () => {
  if (!STRIPE_SECRET_KEY) throw new Error("Stripe key not found")

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  })

  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product as string)

      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount as number,
        interval: price.recurring?.interval as string,
        currency: price.currency,
      }
    })
  )

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  return {
    props: { plans: sortedPlans },
  }
}

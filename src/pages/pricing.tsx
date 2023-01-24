import { InferGetStaticPropsType } from "next"

import Stripe from "stripe"

const Pricing = ({ plans }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>
            {plan.price / 100} / {plan.interval}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Pricing

export const getStaticProps = async () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!stripeKey) throw new Error("Stripe key not found")

  const stripe = new Stripe(stripeKey, {
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

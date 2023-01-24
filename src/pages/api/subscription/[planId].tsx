import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

import { supabaseAdmin } from "@/utils/supabase-admin"
import axios from "axios"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL
const API_ROUTE_KEY = process.env.API_ROUTE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!STRIPE_SECRET_KEY) throw new Error("Stripe key not found")
  if (!NEXT_PUBLIC_APP_URL) throw new Error("Missing App URL")
  if (!API_ROUTE_KEY) throw new Error("Api route key not found")

  const { planId } = req.query
  const token = req.cookies["sb-access-token"]
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token)

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await axios.post(`${NEXT_PUBLIC_APP_URL}/api/create-stripe-customer?key=${API_ROUTE_KEY}`, {
    email: user.email,
    id: user.id,
  })

  const { data } = await supabaseAdmin.from("profile").select("stripe_customer").eq("id", user.id).single()

  if (!data) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  })

  const lineItems = [
    {
      price: planId as string,
      quantity: 1,
    },
  ]

  const session = await stripe.checkout.sessions.create({
    customer: data.stripe_customer as string,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${NEXT_PUBLIC_APP_URL}/payment/success`,
    cancel_url: `${NEXT_PUBLIC_APP_URL}/payment/cancelled`,
  })

  res.status(200).json({
    id: session.id,
  })
}

import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

import { supabaseAdmin } from "@/utils/supabase-admin"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const API_ROUTE_KEY = process.env.API_ROUTE_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!STRIPE_SECRET_KEY) throw new Error("Stripe key not found")
  if (!API_ROUTE_KEY) throw new Error("Api route key not found")

  if (req.query.key !== API_ROUTE_KEY) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  })

  const customer = await stripe.customers.create({
    email: req.body.email,
  })

  await supabaseAdmin
    .from("profile")
    .update({
      stripe_customer: customer.id,
    })
    .eq("id", req.body.id)
    .select()

  res.status(200).json({ message: `stripe customer created: ${customer.id}` })
}

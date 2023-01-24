import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/database"

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error("Missing Supabase URL or key")

export const supabaseAdmin = createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY)

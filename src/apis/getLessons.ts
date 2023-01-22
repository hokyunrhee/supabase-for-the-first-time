import { supabase } from "@/utils/supabase"

export async function getLessons() {
  return await supabase.from("lesson").select("*")
}

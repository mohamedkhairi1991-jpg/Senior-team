import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !serviceKey) {
  console.warn("⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars.");
}

export const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
});

export async function pingSupabase() {
  // Try to count patients table (works even if empty)
  const { error } = await supabase
    .from("patients")
    .select("id", { count: "exact", head: true });
  if (error) return { ok: false, error: error.message }; 
  return { ok: true };
}
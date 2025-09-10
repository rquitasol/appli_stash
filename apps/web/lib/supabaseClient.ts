import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env
  .NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env
  .NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceRoleKey = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string;

// Client for client-side and general server-side usage
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

// Admin client for privileged server-side actions (never expose serviceRoleKey to client)
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
);

// Returns a Supabase client with the user's JWT for RLS
export function getSupabaseForUser(jwt: string) {
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}

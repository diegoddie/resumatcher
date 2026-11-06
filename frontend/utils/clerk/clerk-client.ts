import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function createClerkSupabaseClientSsr() {
  const { getToken } = await auth()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      // Clerk session token, trusted by Supabase through the Clerk third-party auth integration
      // (no JWT template: it's deprecated since April 2025)
      async accessToken() {
        return getToken()
      },
    },
  )
}

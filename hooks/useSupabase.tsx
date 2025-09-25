"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

// Create a custom supabase client that injects the Clerk Supabase token into the request headers
const useSupabase = () => {
  const { session } = useSession();

  // Create a custom Supabase client that injects the Clerk session token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      }
    );
  }
  // Create a `client` object for accessing Supabase data using the Clerk token
  const client = createClerkSupabaseClient();

  return client;
};

export default useSupabase;

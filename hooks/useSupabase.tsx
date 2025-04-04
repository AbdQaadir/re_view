"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

// Create a custom supabase client that injects the Clerk Supabase token into the request headers
const useSupabase = () => {
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        // Get the custom Supabase token from Clerk
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: "supabase",
          });

          // Insert the Clerk Supabase token into the headers
          const headers = new Headers(options?.headers);

          if (clerkToken) {
            headers.set("Authorization", `Bearer ${clerkToken}`);
          }

          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
};

export default useSupabase;

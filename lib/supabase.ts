import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

async function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken() || "";
      },
    }
  );
}

const supabase = await createServerSupabaseClient();

export default supabase;

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase";
import { DB_TABLES } from "@/app/_constants";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const data = evt.data;
      await supabase.from(DB_TABLES.USER).insert({
        user_id: data.id,
        email: data.email_addresses[0].email_address,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data?.username,
        profile_image: data.image_url,
      });
    }

    if (eventType === "user.updated") {
      const data = evt.data;

      await supabase
        .from(DB_TABLES.USER)
        .upsert(
          {
            user_id: data.id,
            email: data.email_addresses[0].email_address,
            first_name: data.first_name,
            last_name: data.last_name,
            username: data?.username,
            profile_image: data.image_url,
          },
          {
            onConflict: "user_id",
          }
        )
        .eq("user_id", data.id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error: any) {
    console.log("Supabase error:", error);
    return new Response("Error: Supabase error" + error.message, {
      status: 500,
    });
  }
}

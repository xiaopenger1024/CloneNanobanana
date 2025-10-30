import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client for webhook handler
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = body.type || body.event_type

    console.log("Webhook received:", eventType, body)

    // Handle different webhook events
    switch (eventType) {
      case "checkout.completed":
        await handleCheckoutCompleted(body)
        break

      case "subscription.active":
      case "subscription.paid":
        await handleSubscriptionActive(body)
        break

      case "subscription.canceled":
      case "subscription.expired":
        await handleSubscriptionCanceled(body)
        break

      default:
        console.log("Unhandled webhook event type:", eventType)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    // Still return 200 to prevent retries
    return NextResponse.json({ received: true, error: String(error) })
  }
}

async function handleCheckoutCompleted(body: any) {
  const metadata = body.data?.metadata || body.metadata
  const userId = metadata?.user_id
  const userEmail = metadata?.user_email
  const planName = metadata?.plan_name
  const status = body.data?.status || body.status

  console.log("Checkout completed:", { userId, userEmail, planName, status })

  if (!userId || !userEmail) {
    console.error("Missing user information in webhook metadata")
    return
  }

  // Only process if checkout is completed
  if (status !== "completed") {
    console.log("Checkout not completed yet, skipping")
    return
  }

  // Update user_usage table to mark user as paid
  const { error } = await supabaseAdmin
    .from("user_usage")
    .upsert(
      {
        user_id: userId,
        email: userEmail,
        is_paid: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )

  if (error) {
    console.error("Error updating user_usage:", error)
  } else {
    console.log("Successfully updated user as paid:", userEmail)
  }
}

async function handleSubscriptionActive(body: any) {
  const metadata = body.data?.metadata || body.metadata
  const userId = metadata?.user_id
  const userEmail = metadata?.user_email

  console.log("Subscription active:", { userId, userEmail })

  if (!userId || !userEmail) {
    console.error("Missing user information in webhook metadata")
    return
  }

  // Update user_usage table to mark user as paid
  const { error } = await supabaseAdmin
    .from("user_usage")
    .upsert(
      {
        user_id: userId,
        email: userEmail,
        is_paid: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )

  if (error) {
    console.error("Error updating user_usage:", error)
  } else {
    console.log("Successfully activated subscription:", userEmail)
  }
}

async function handleSubscriptionCanceled(body: any) {
  const metadata = body.data?.metadata || body.metadata
  const userId = metadata?.user_id
  const userEmail = metadata?.user_email

  console.log("Subscription canceled:", { userId, userEmail })

  if (!userId || !userEmail) {
    console.error("Missing user information in webhook metadata")
    return
  }

  // Update user_usage table to remove paid status
  const { error } = await supabaseAdmin
    .from("user_usage")
    .update({
      is_paid: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating user_usage:", error)
  } else {
    console.log("Successfully canceled subscription:", userEmail)
  }
}

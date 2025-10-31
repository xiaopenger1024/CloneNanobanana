import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client for webhook handler
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Credits allocation based on plan
const PLAN_CREDITS = {
  Basic: 1800,   // 900 images (2 credits = 1 image)
  Pro: 9600,     // 4,800 images
  Max: 55200,    // 27,600 images
}

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
  const data = body.data || body

  const userId = metadata?.user_id
  const userEmail = metadata?.user_email
  const planName = metadata?.plan_name || 'Basic'
  const billingType = metadata?.billing_type || 'monthly'
  const status = data?.status || body.status

  // Extract Creem IDs
  const orderId = data?.order_id || data?.id
  const customerId = data?.customer_id
  const subscriptionId = data?.subscription_id

  console.log("Checkout completed:", {
    userId, userEmail, planName, billingType, status,
    orderId, customerId, subscriptionId
  })

  if (!userId || !userEmail) {
    console.error("Missing user information in webhook metadata")
    return
  }

  // Only process if checkout is completed
  if (status !== "completed") {
    console.log("Checkout not completed yet, skipping")
    return
  }

  // Get credits amount for the plan
  const totalCredits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || PLAN_CREDITS.Basic

  // Call allocate_credits function to update user with credits
  const { error } = await supabaseAdmin.rpc('allocate_credits', {
    p_user_id: userId,
    p_email: userEmail,
    p_plan_name: planName,
    p_billing_type: billingType,
    p_total_credits: totalCredits,
    p_subscription_id: subscriptionId,
    p_customer_id: customerId,
    p_order_id: orderId,
  })

  if (error) {
    console.error("Error allocating credits:", error)
  } else {
    console.log(`Successfully allocated ${totalCredits} credits to ${userEmail} (${planName} - ${billingType})`)
  }
}

async function handleSubscriptionActive(body: any) {
  const metadata = body.data?.metadata || body.metadata
  const data = body.data || body

  const userId = metadata?.user_id
  const userEmail = metadata?.user_email
  const planName = metadata?.plan_name || 'Basic'
  const billingType = metadata?.billing_type || 'monthly'

  // Extract Creem IDs
  const subscriptionId = data?.subscription_id || data?.id
  const customerId = data?.customer_id
  const orderId = data?.order_id

  console.log("Subscription active:", {
    userId, userEmail, planName, billingType,
    subscriptionId, customerId
  })

  if (!userId || !userEmail) {
    console.error("Missing user information in webhook metadata")
    return
  }

  // Get credits amount for the plan
  const totalCredits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || PLAN_CREDITS.Basic

  // Call allocate_credits function
  const { error } = await supabaseAdmin.rpc('allocate_credits', {
    p_user_id: userId,
    p_email: userEmail,
    p_plan_name: planName,
    p_billing_type: billingType,
    p_total_credits: totalCredits,
    p_subscription_id: subscriptionId,
    p_customer_id: customerId,
    p_order_id: orderId,
  })

  if (error) {
    console.error("Error allocating credits:", error)
  } else {
    console.log(`Successfully activated subscription with ${totalCredits} credits: ${userEmail}`)
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

  // Update user_usage table to remove paid status and clear credits
  const { error } = await supabaseAdmin
    .from("user_usage")
    .update({
      is_paid: false,
      remaining_credits: 0,
      plan_name: null,
      subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating user_usage:", error)
  } else {
    console.log("Successfully canceled subscription:", userEmail)
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createHmac } from "crypto"

// Create Supabase admin client for webhook handler
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Credits allocation based on plan and billing type
// 2 credits = 1 image
const PLAN_CREDITS = {
  Basic: {
    monthly: 150,    // 75 images/month
    yearly: 1800,    // 900 images/year (75 * 12)
  },
  Pro: {
    monthly: 800,    // 400 images/month
    yearly: 9600,    // 4,800 images/year (400 * 12)
  },
  Max: {
    monthly: 4600,   // 2,300 images/month
    yearly: 55200,   // 27,600 images/year (2,300 * 12)
  },
}

// Verify Creem webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) {
    console.warn("⚠️ CREEM_WEBHOOK_SECRET not configured - skipping signature verification")
    return true
  }

  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return signature === expectedSignature || signature === `sha256=${expectedSignature}`
  } catch (error) {
    console.error("Error verifying webhook signature:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-creem-signature') || request.headers.get('creem-signature') || ''
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET || ''

    // Verify webhook signature
    if (webhookSecret && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error("❌ Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log("✅ Webhook signature verified")

    const body = JSON.parse(rawBody)
    // Creem uses 'eventType' (camelCase), not 'type' or 'event_type'
    const eventType = body.type || body.event_type || body.eventType

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
  // 增强的日志：打印完整的webhook payload
  console.log("=== FULL WEBHOOK PAYLOAD ===")
  console.log(JSON.stringify(body, null, 2))
  console.log("============================")

  // Creem's actual payload structure: body.object contains the checkout data
  const metadata = body.object?.metadata || body.data?.metadata || body.metadata
  const data = body.object || body.data || body

  const userId = metadata?.user_id
  const userEmail = metadata?.user_email
  const planName = metadata?.plan_name || 'Basic'
  const billingType = metadata?.billing_type || 'monthly'
  const status = data?.status || body.status

  // Extract Creem IDs from the order object
  const orderId = data?.order?.id || data?.order_id || data?.id
  const customerId = data?.customer?.id || data?.customer_id
  const subscriptionId = data?.subscription?.id || data?.subscription_id

  console.log("=== EXTRACTED DATA ===")
  console.log("Checkout completed:", {
    userId, userEmail, planName, billingType, status,
    orderId, customerId, subscriptionId
  })
  console.log("Metadata available:", !!metadata)
  console.log("Metadata content:", JSON.stringify(metadata, null, 2))
  console.log("=====================")

  if (!userId || !userEmail) {
    console.error("❌ Missing user information in webhook metadata")
    console.error("Available keys in body:", Object.keys(body))
    console.error("Available keys in body.data:", Object.keys(body.data || {}))
    console.error("Available keys in metadata:", Object.keys(metadata || {}))
    return
  }

  // Only process if checkout is completed
  if (status !== "completed") {
    console.log("Checkout not completed yet, skipping")
    return
  }

  // Get credits amount for the plan and billing type
  const planCredits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || PLAN_CREDITS.Basic
  const totalCredits = billingType === 'yearly' ? planCredits.yearly : planCredits.monthly

  console.log(`💳 Allocating credits: ${planName} ${billingType} = ${totalCredits} credits (${totalCredits / 2} images)`)

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
  // Creem's actual payload structure: body.object contains the subscription data
  const metadata = body.object?.metadata || body.data?.metadata || body.metadata
  const data = body.object || body.data || body

  const userId = metadata?.user_id
  const userEmail = metadata?.user_email
  const planName = metadata?.plan_name || 'Basic'
  const billingType = metadata?.billing_type || 'monthly'

  // Extract Creem IDs from the subscription/order object
  const subscriptionId = data?.subscription?.id || data?.subscription_id || data?.id
  const customerId = data?.customer?.id || data?.customer_id
  const orderId = data?.order?.id || data?.order_id

  console.log("Subscription active:", {
    userId, userEmail, planName, billingType,
    subscriptionId, customerId
  })

  if (!userId || !userEmail) {
    console.error("Missing user information in webhook metadata")
    return
  }

  // Get credits amount for the plan and billing type
  const planCredits = PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || PLAN_CREDITS.Basic
  const totalCredits = billingType === 'yearly' ? planCredits.yearly : planCredits.monthly

  console.log(`💳 Allocating credits: ${planName} ${billingType} = ${totalCredits} credits (${totalCredits / 2} images)`)

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
  // Creem's actual payload structure: body.object contains the subscription data
  const metadata = body.object?.metadata || body.data?.metadata || body.metadata
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

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, planName, billingType, email } = body

    if (!productId || !planName || !billingType) {
      return NextResponse.json(
        { error: "Missing required fields: productId, planName, billingType" },
        { status: 400 }
      )
    }

    // Get Creem API key from environment
    const creemApiKey = process.env.CREEM_API_KEY
    if (!creemApiKey || creemApiKey === 'your_creem_api_key_here') {
      console.error("CREEM_API_KEY is not configured")
      return NextResponse.json(
        { error: "Payment system not configured. Please configure your Creem API keys in the environment variables." },
        { status: 503 }
      )
    }

    // Determine if we're in test mode based on API key
    const isTestMode = creemApiKey.startsWith('creem_test_')
    const apiBaseUrl = isTestMode
      ? 'https://test-api.creem.io/v1/checkouts'
      : 'https://api.creem.io/v1/checkouts'

    console.log("Creem API Mode:", isTestMode ? "TEST" : "PRODUCTION")

    // Validate product ID format (allow "placeholder" for coming soon plans)
    if (!productId || productId.includes('_product_placeholder')) {
      console.error("Invalid product ID:", productId)
      return NextResponse.json(
        {
          error: "This plan is not yet available. Please choose another plan or check back later.",
          hint: "Only the Basic plan is currently active for purchase."
        },
        { status: 400 }
      )
    }

    // Validate that product ID is from Creem (starts with "prod_")
    if (!productId.startsWith('prod_')) {
      console.error("Invalid product ID format:", productId)
      return NextResponse.json(
        {
          error: "Invalid product configuration. Please ensure product IDs are properly configured.",
          hint: "Product IDs should be from your Creem dashboard (e.g., 'prod_xxxxx')"
        },
        { status: 400 }
      )
    }

    // Create checkout session with Creem
    const requestBody = {
      product_id: productId,  // Creem API uses product_id
      customer: {
        email: email || user.email,
      },
      // Creem will automatically append: checkout_id, order_id, customer_id, subscription_id
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
        plan_name: planName,
        billing_type: billingType,
      },
    }

    console.log("Creem API Request:", {
      url: apiBaseUrl,
      mode: isTestMode ? "TEST" : "PRODUCTION",
      product_id: productId,
      customer_email: email || user.email,
    })

    const creemResponse = await fetch(apiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": creemApiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!creemResponse.ok) {
      const errorData = await creemResponse.json().catch(() => ({}))
      console.error("Creem API error:", {
        status: creemResponse.status,
        statusText: creemResponse.statusText,
        error: errorData,
        product_id: productId,
      })

      // Return more specific error message
      const errorMessage = errorData.error || errorData.message || "Failed to create checkout session"
      return NextResponse.json(
        {
          error: `Payment error: ${errorMessage}. Please check your Creem configuration.`,
          details: errorData
        },
        { status: creemResponse.status }
      )
    }

    const checkoutSession = await creemResponse.json()

    // Return the checkout URL
    return NextResponse.json({
      checkoutUrl: checkoutSession.checkout_url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}

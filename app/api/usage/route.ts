import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Credits required per image generation
const CREDITS_PER_IMAGE = 2

// Detect if we're in test mode based on Creem API key
const isTestMode = process.env.CREEM_API_KEY?.startsWith('creem_test_') || false

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // Check if user is admin
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    const isAdmin = adminEmails.includes(userEmail)

    if (isAdmin) {
      return NextResponse.json({
        canGenerate: true,
        isAdmin: true,
        isPaid: true,
        remainingCredits: -1, // -1 = unlimited
        totalCredits: -1,
        planName: "Admin",
        message: "Admin account - unlimited generations",
        testMode: isTestMode,
      })
    }

    // Query user usage record
    const { data: usage, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (usageError && usageError.code !== "PGRST116") {
      console.error("Error fetching user usage:", usageError)
      return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
    }

    // If no record, create new one (free trial: 2 credits = 1 image)
    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from("user_usage")
        .insert({
          user_id: user.id,
          email: userEmail,
          generation_count: 0,
          is_paid: false,
          remaining_credits: 2, // Free trial: 1 image
          total_credits: 2,
          plan_name: "Free Trial",
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating usage record:", insertError)
        return NextResponse.json({ error: "Failed to create usage record" }, { status: 500 })
      }

      return NextResponse.json({
        canGenerate: true,
        isAdmin: false,
        isPaid: false,
        remainingCredits: 2,
        totalCredits: 2,
        planName: "Free Trial",
        message: "Free trial: 1 generation available",
        testMode: isTestMode,
      })
    }

    // Return user credits info
    const remainingCredits = usage.remaining_credits || 0
    const totalCredits = usage.total_credits || 0
    const canGenerate = remainingCredits >= CREDITS_PER_IMAGE

    return NextResponse.json({
      canGenerate,
      isAdmin: false,
      isPaid: usage.is_paid || false,
      remainingCredits,
      totalCredits,
      planName: usage.plan_name || "Free Trial",
      billingType: usage.billing_type,
      subscriptionEndDate: usage.subscription_end_date,
      testMode: isTestMode,
      message: canGenerate
        ? `${Math.floor(remainingCredits / CREDITS_PER_IMAGE)} generation(s) remaining`
        : "Insufficient credits. Please upgrade to continue.",
    })
  } catch (error) {
    console.error("Error in usage check:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("🔥 POST /api/usage called - NEW CODE LOADED 🔥")
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // Check if user is admin (admin doesn't deduct credits)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    const isAdmin = adminEmails.includes(userEmail)

    if (isAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin account - no credit deduction",
        remainingCredits: -1,
      })
    }

    // Deduct credits using the database function
    const { data, error: deductError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_credits: CREDITS_PER_IMAGE,
    })

    if (deductError) {
      console.error("Error deducting credits:", deductError)
      return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 })
    }

    // 添加调试日志
    console.log("=== Deduct Credits Debug ===")
    console.log("Raw data:", JSON.stringify(data))
    console.log("Data type:", typeof data)
    console.log("Is array:", Array.isArray(data))
    console.log("===========================")

    // Also increment generation_count for backward compatibility
    await supabase.rpc("increment_generation_count", {
      p_user_id: user.id,
    }).catch(() => {
      // Ignore error if function doesn't exist
    })

    // 尝试多种可能的解析方式
    let result: any = null
    let remainingCredits: number = 0

    if (Array.isArray(data) && data.length > 0) {
      // 如果是数组，取第一个元素
      result = data[0]
    } else if (data && typeof data === 'object') {
      // 如果是对象，直接使用
      result = data
    }

    console.log("=== Result Debug ===")
    console.log("Parsed result:", JSON.stringify(result))
    console.log("result.success:", result?.success)
    console.log("result.remaining:", result?.remaining)
    console.log("====================")

    // 尝试获取 remaining credits
    if (result) {
      // 尝试多种可能的字段名
      remainingCredits = result.remaining ?? result.remaining_credits ?? result.remainingCredits ?? 0
    }

    console.log("Final remainingCredits:", remainingCredits)

    if (!result || result.success === false) {
      return NextResponse.json({
        success: false,
        error: "Failed to deduct credits",
        remainingCredits: 0,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Deducted ${CREDITS_PER_IMAGE} credits`,
      remainingCredits: remainingCredits,
    })
  } catch (error) {
    console.error("Error deducting credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT method to manually update payment status (used by payment success page)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { is_paid, order_id, checkout_id, customer_id, subscription_id } = body

    if (typeof is_paid !== 'boolean') {
      return NextResponse.json({ error: "Invalid is_paid value" }, { status: 400 })
    }

    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // Update or insert user payment status
    const updateData: any = {
      user_id: user.id,
      email: userEmail,
      is_paid: is_paid,
      updated_at: new Date().toISOString(),
    }

    if (customer_id) updateData.customer_id = customer_id
    if (subscription_id) updateData.subscription_id = subscription_id
    if (order_id) updateData.order_id = order_id

    const { error: upsertError } = await supabase
      .from("user_usage")
      .upsert(updateData, {
        onConflict: "user_id",
      })

    if (upsertError) {
      console.error("Error updating payment status:", upsertError)
      return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
    }

    console.log(`Payment status updated for user ${userEmail}: is_paid=${is_paid}, order_id=${order_id}`)

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      is_paid: is_paid,
    })
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

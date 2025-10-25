import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 获取当前用户
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

    // 检查是否是管理员
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    const isAdmin = adminEmails.includes(userEmail)

    if (isAdmin) {
      return NextResponse.json({
        canGenerate: true,
        isAdmin: true,
        isPaid: true,
        generationCount: 0,
        remainingGenerations: -1, // -1 表示无限
        message: "Admin account - unlimited generations",
      })
    }

    // 查询用户使用记录
    const { data: usage, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (usageError && usageError.code !== "PGRST116") {
      // PGRST116 是"未找到记录"错误
      console.error("Error fetching user usage:", usageError)
      return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
    }

    // 如果没有记录，创建新记录
    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from("user_usage")
        .insert({
          user_id: user.id,
          email: userEmail,
          generation_count: 0,
          is_paid: false,
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
        generationCount: 0,
        remainingGenerations: 1,
        message: "First generation available",
      })
    }

    // 检查是否已付费
    if (usage.is_paid) {
      return NextResponse.json({
        canGenerate: true,
        isAdmin: false,
        isPaid: true,
        generationCount: usage.generation_count,
        remainingGenerations: -1, // -1 表示无限
        message: "Paid account - unlimited generations",
      })
    }

    // 免费用户只能使用 1 次
    const canGenerate = usage.generation_count < 1
    const remainingGenerations = Math.max(0, 1 - usage.generation_count)

    return NextResponse.json({
      canGenerate,
      isAdmin: false,
      isPaid: false,
      generationCount: usage.generation_count,
      remainingGenerations,
      message: canGenerate ? `${remainingGenerations} generation(s) remaining` : "Free trial exhausted. Please upgrade to continue.",
    })
  } catch (error) {
    console.error("Error in usage check:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 获取当前用户
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

    // 检查是否是管理员（管理员不需要增加计数）
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || []
    const isAdmin = adminEmails.includes(userEmail)

    if (isAdmin) {
      return NextResponse.json({ success: true, message: "Admin account - no count increment" })
    }

    // 增加使用次数
    const { error: updateError } = await supabase.rpc("increment_generation_count", {
      p_user_id: user.id,
    })

    if (updateError) {
      // 如果函数不存在，使用传统方式更新
      const { data: currentUsage } = await supabase
        .from("user_usage")
        .select("generation_count")
        .eq("user_id", user.id)
        .single()

      if (currentUsage) {
        await supabase
          .from("user_usage")
          .update({ generation_count: currentUsage.generation_count + 1 })
          .eq("user_id", user.id)
      }
    }

    return NextResponse.json({ success: true, message: "Generation count incremented" })
  } catch (error) {
    console.error("Error incrementing usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

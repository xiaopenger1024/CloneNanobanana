import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://nanobanana.ai",
    "X-Title": "Nano Banana AI Image Editor",
  },
})

// Detect if we're in test mode based on Creem API key
const isTestMode = process.env.CREEM_API_KEY?.startsWith('creem_test_') || false
const CREDITS_PER_IMAGE = 2

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 })
    }

    // Check user authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check user credits before generation
    const usageResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/usage`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    })

    if (!usageResponse.ok) {
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
    }

    const usageData = await usageResponse.json()

    if (!usageData.canGenerate) {
      return NextResponse.json({
        error: "Insufficient credits",
        message: usageData.message,
        remainingCredits: usageData.remainingCredits || 0,
      }, { status: 403 })
    }

    console.log(`Generation request from ${user.email} in ${isTestMode ? 'TEST' : 'PRODUCTION'} mode`)

    let generatedImages: string[] = []
    let textContent = ""

    if (isTestMode) {
      // Test mode: Return simulated success response without calling actual API
      console.log("Test mode: Simulating image generation")

      generatedImages = [
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzRGNDZFNSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIPCfjY0gVEVTVCBNT0RFIPCFJQ0KICA8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICBJbWFnZSBnZW5lcmF0aW9uIHNpbXVsYXRlZAogIDwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjY1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgQ3JlZGl0cyBkZWR1Y3RlZCBzdWNjZXNzZnVsbHkKICA8L3RleHQ+Cjwvc3ZnPg=="
      ]
      textContent = "✅ Test mode: Image generation simulated successfully. Credits have been deducted."

    } else {
      // Production mode: Call actual OpenRouter API
      console.log("Production mode: Calling Gemini API with prompt:", prompt)

      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
      })

      console.log("API Response:", JSON.stringify(completion, null, 2))

      // Get the generated images from the response
      const message = completion.choices[0]?.message
      generatedImages = (message as any)?.images || []
      textContent = message?.content || ""

      if (generatedImages.length === 0 && !textContent) {
        console.error("No content or images in response:", completion)
        return NextResponse.json({ error: "No response from API" }, { status: 500 })
      }
    }

    // Deduct credits directly using Supabase RPC
    console.log("🔥 Deducting credits directly from generate route")
    const { data: deductResult, error: deductError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_credits: CREDITS_PER_IMAGE,
    })

    console.log("Deduct result:", JSON.stringify(deductResult))
    console.log("Deduct error:", deductError)

    let remainingCredits = usageData.remainingCredits - CREDITS_PER_IMAGE // fallback

    if (!deductError && deductResult) {
      // Try to parse the result
      let result: any = deductResult
      if (Array.isArray(deductResult) && deductResult.length > 0) {
        result = deductResult[0]
      }

      // Extract remaining credits
      const remaining = result.remaining ?? result.remaining_credits ?? result.remainingCredits
      if (remaining !== undefined) {
        remainingCredits = remaining
        console.log(`✅ Credits deducted successfully. Remaining: ${remainingCredits}`)
      } else {
        console.error("⚠️ Could not parse remaining credits from result:", result)
      }
    } else {
      console.error("❌ Failed to deduct credits:", deductError)
    }

    // Also increment generation_count for backward compatibility
    const { error: incrementError } = await supabase.rpc("increment_generation_count", {
      p_user_id: user.id,
    })
    // Silently ignore error if function doesn't exist
    if (incrementError) {
      console.log("Note: increment_generation_count not executed (expected if using credits system)")
    }

    return NextResponse.json({
      images: generatedImages,
      text: textContent,
      remainingCredits,
      testMode: isTestMode,
      message: isTestMode
        ? `✅ Test mode: Generation simulated. ${CREDITS_PER_IMAGE} credits deducted. Remaining: ${remainingCredits} credits.`
        : `Generation successful. ${CREDITS_PER_IMAGE} credits deducted. Remaining: ${remainingCredits} credits.`,
    })
  } catch (error) {
    console.error("Error in generate API:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 },
    )
  }
}

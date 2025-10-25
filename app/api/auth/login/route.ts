import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  // Get provider from request body (default to github for backward compatibility)
  const body = await request.json()
  const provider = body.provider || "github"

  // Validate provider
  if (!["github", "google"].includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "github" | "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}

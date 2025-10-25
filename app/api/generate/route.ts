import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://nanobanana.ai",
    "X-Title": "Nano Banana AI Image Editor",
  },
})

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json()

    if (!image || !prompt) {
      return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 })
    }

    console.log("Calling Gemini API with prompt:", prompt)

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
    const generatedImages = (message as any)?.images || []
    const textContent = message?.content

    if (generatedImages.length === 0 && !textContent) {
      console.error("No content or images in response:", completion)
      return NextResponse.json({ error: "No response from API" }, { status: 500 })
    }

    return NextResponse.json({
      images: generatedImages,
      text: textContent,
    })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 },
    )
  }
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, Loader2, Download, LogIn, Crown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UsageInfo {
  canGenerate: boolean
  isAdmin: boolean
  isPaid: boolean
  generationCount: number
  remainingGenerations: number
  message: string
}

export function Editor() {
  const [user, setUser] = useState<User | null>(null)
  const [usageInfo, setUsageInfo] = useState<UsageInfo | null>(null)
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [generatedText, setGeneratedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // 获取使用次数信息
  useEffect(() => {
    if (user) {
      fetchUsageInfo()
    } else {
      setUsageInfo(null)
    }
  }, [user])

  const fetchUsageInfo = async () => {
    try {
      const response = await fetch("/api/usage")
      if (response.ok) {
        const data = await response.json()
        setUsageInfo(data)
      }
    } catch (error) {
      console.error("Failed to fetch usage info:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setGeneratedImages([])
        setGeneratedText(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    // Check if user is logged in
    if (!user) {
      setError("Please sign in to use the AI Editor. Click the 'Sign In' button at the top of the page.")
      return
    }

    // Check usage limits
    if (usageInfo && !usageInfo.canGenerate) {
      setError("You have exhausted your free trial. Please upgrade to a paid plan to continue using the AI Editor.")
      return
    }

    if (!selectedImage || !prompt) {
      setError("Please upload an image and enter a prompt")
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedImages([])
    setGeneratedText(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: prompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate")
      }

      setGeneratedImages(data.images || [])
      setGeneratedText(data.text || null)

      // 增加使用次数（成功生成后）
      await fetch("/api/usage", { method: "POST" })

      // 刷新使用次数信息
      await fetchUsageInfo()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `nano-banana-generated-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="editor" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">AI Image Editor</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands
          </p>
          {user && usageInfo && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              {usageInfo.isAdmin ? (
                <>
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Admin Account - Unlimited Access</span>
                </>
              ) : usageInfo.isPaid ? (
                <>
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Paid Account - Unlimited Generations</span>
                </>
              ) : (
                <span className="text-sm font-medium">
                  Free Trial: {usageInfo.remainingGenerations} generation{usageInfo.remainingGenerations !== 1 ? 's' : ''} remaining
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Prompt Engine */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍌</span>
                <h3 className="text-xl font-semibold">Prompt Engine</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Transform your image with AI-powered editing</p>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Reference Image</label>
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  {selectedImage ? (
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add Image</p>
                      <p className="text-xs text-muted-foreground">Max 50MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Main Prompt */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Main Prompt</label>
                <Textarea
                  placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={handleGenerate}
                disabled={isLoading || !selectedImage || !prompt || (usageInfo !== null && !usageInfo.canGenerate)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>

              {!user && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in required - Click here to login
                </Button>
              )}

              {user && usageInfo && !usageInfo.canGenerate && !usageInfo.isPaid && !usageInfo.isAdmin && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                    Free Trial Exhausted
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                    You've used your 1 free generation. Upgrade to unlock unlimited AI image editing.
                  </p>
                  <Button className="w-full" size="sm">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Gallery */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-semibold">Output Gallery</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Your ultra-fast AI creations appear here instantly</p>

              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-96">
                {isLoading ? (
                  <>
                    <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
                    <p className="text-lg font-medium mb-2">Generating your image...</p>
                    <p className="text-sm text-muted-foreground text-center">Please wait while AI works its magic</p>
                  </>
                ) : error ? (
                  <>
                    <div className="text-6xl mb-4 opacity-20">⚠️</div>
                    <p className="text-lg font-medium mb-2 text-destructive">Error</p>
                    <p className="text-sm text-muted-foreground text-center">{error}</p>
                  </>
                ) : generatedImages.length > 0 ? (
                  <div className="w-full space-y-4">
                    {generatedImages.map((img, index) => {
                      // Extract image URL from the object structure
                      const imageUrl = typeof img === 'string' ? img : (img as any)?.image_url?.url || ''

                      return (
                        <div key={index} className="w-full relative group">
                          <img
                            src={imageUrl}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-auto rounded-lg shadow-lg"
                          />
                          <Button
                            onClick={() => handleDownload(imageUrl, index)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            size="sm"
                            variant="secondary"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      )
                    })}
                    {generatedText && (
                      <div className="bg-muted rounded-lg p-4 mt-4">
                        <p className="text-sm whitespace-pre-wrap">{generatedText}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-6xl mb-4 opacity-20">🖼️</div>
                    <p className="text-lg font-medium mb-2">Ready for Instant generation</p>
                    <p className="text-sm text-muted-foreground text-center">Enter your prompt and unleash the power</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles } from "lucide-react"

export function Editor() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <section id="editor" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Try The AI Editor</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands
          </p>
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
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
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

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Now
              </Button>
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

              <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center min-h-96">
                <div className="text-6xl mb-4 opacity-20">🖼️</div>
                <p className="text-lg font-medium mb-2">Ready for Instant generation</p>
                <p className="text-sm text-muted-foreground text-center">Enter your prompt and unleash the power</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

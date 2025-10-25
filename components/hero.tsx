import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Decorative bananas */}
      <div
        className="absolute left-10 top-20 text-6xl opacity-20 animate-bounce"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      >
        🍌
      </div>
      <div
        className="absolute right-10 top-20 text-6xl opacity-20 animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      >
        🍌
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <span className="mr-1">🍌</span>
            The AI model that outperforms Flux Kontext
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance mb-6">
            <span className="bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">
              Nano Banana
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
            editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
              Start Editing
              <span className="ml-2">✨</span>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
              View Examples
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span>One-shot editing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span>Multi-image support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <span>Natural language</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: "🎨",
    title: "Advanced AI Model",
    description: "Powered by cutting-edge AI technology that understands context and preserves image quality.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Get your edited images in seconds, not minutes. Our optimized pipeline ensures rapid processing.",
  },
  {
    icon: "🎯",
    title: "Precise Control",
    description: "Fine-tune every aspect of your image with natural language commands and intuitive controls.",
  },
  {
    icon: "🔄",
    title: "Batch Processing",
    description: "Edit multiple images at once with consistent results across your entire collection.",
  },
  {
    icon: "🌟",
    title: "Character Consistency",
    description: "Maintain character features and style across different scenes and compositions.",
  },
  {
    icon: "🛡️",
    title: "Scene Preservation",
    description: "Keep your original scene intact while making targeted edits to specific elements.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Powerful Features for Creative Control</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Everything you need to transform your images with AI-powered precision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

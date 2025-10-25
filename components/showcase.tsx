import { Card, CardContent } from "@/components/ui/card"

const showcaseItems = [
  {
    title: "Portrait Enhancement",
    description: "Transform portraits with natural lighting and professional quality",
    image: "/professional-portrait-with-natural-lighting.jpg",
  },
  {
    title: "Scene Transformation",
    description: "Change environments while maintaining character consistency",
    image: "/character-in-different-scenic-environment.jpg",
  },
  {
    title: "Style Transfer",
    description: "Apply artistic styles while preserving original composition",
    image: "/artistic-style-transfer-on-photograph.jpg",
  },
  {
    title: "Object Manipulation",
    description: "Add, remove, or modify objects with precision",
    image: "/photo-with-objects-added-or-removed.jpg",
  },
  {
    title: "Color Grading",
    description: "Professional color correction and mood enhancement",
    image: "/color-graded-cinematic-photo.jpg",
  },
  {
    title: "Background Replacement",
    description: "Seamlessly replace backgrounds with AI precision",
    image: "/person-with-replaced-background.jpg",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Showcase Gallery</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            See what's possible with Nano Banana's advanced AI editing capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

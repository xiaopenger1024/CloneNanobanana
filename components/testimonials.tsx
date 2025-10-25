import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Professional Photographer",
    avatar: "👩‍💼",
    rating: 5,
    content:
      "Nano Banana has completely transformed my workflow. The character consistency across edits is unmatched. I can now deliver projects 3x faster!",
  },
  {
    name: "Marcus Rodriguez",
    role: "Digital Artist",
    avatar: "👨‍🎨",
    rating: 5,
    content:
      "The natural language interface is incredibly intuitive. I can describe exactly what I want and the AI delivers. It's like having a creative partner.",
  },
  {
    name: "Emily Watson",
    role: "Content Creator",
    avatar: "👩‍💻",
    rating: 5,
    content:
      "Best AI image editor I've used. The scene preservation feature is a game-changer for maintaining brand consistency across all my content.",
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    avatar: "👨‍💼",
    rating: 5,
    content:
      "Our team productivity has skyrocketed. Batch processing saves us hours every week, and the quality is consistently excellent.",
  },
  {
    name: "Lisa Anderson",
    role: "Graphic Designer",
    avatar: "👩‍🎨",
    rating: 5,
    content:
      "The precision and control are outstanding. I can make subtle adjustments or dramatic changes with equal ease. Highly recommended!",
  },
  {
    name: "James Taylor",
    role: "Social Media Manager",
    avatar: "👨‍💻",
    rating: 5,
    content:
      "Creating engaging content has never been easier. The AI understands context perfectly and delivers exactly what I envision.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Loved by Creators Worldwide</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their creative workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

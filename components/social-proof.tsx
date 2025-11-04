import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Image, Star, Zap } from "lucide-react"

export function SocialProof() {
  return (
    <section id="social-proof" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Trusted Platform
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Built for Creators, Powered by AI
          </h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Real metrics, real results, real value
          </p>
        </div>

        {/* Real Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-3xl font-bold">Active</CardTitle>
              <CardDescription>Users Growing</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Image className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-3xl font-bold">Fast</CardTitle>
              <CardDescription>Generation Speed</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-3xl font-bold">Easy</CardTitle>
              <CardDescription>Natural Language</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-3xl font-bold">Quality</CardTitle>
              <CardDescription>AI Technology</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👨‍💼</span>
                For Content Creators
              </CardTitle>
              <CardDescription>
                Streamline your creative workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Batch edit social media content efficiently</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Maintain consistent brand identity across all images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Natural language editing - describe what you want</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Faster turnaround time for client projects</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👩‍🎨</span>
                For Designers & Artists
              </CardTitle>
              <CardDescription>
                Enhance your creative capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Rapid prototyping and iteration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Scene preservation and character consistency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Precise control over subtle or dramatic changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Professional-grade results with simple prompts</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                For Marketing Teams
              </CardTitle>
              <CardDescription>
                Scale your visual content production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Team collaboration with credit management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Batch processing for campaign materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Consistent quality across all deliverables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Flexible subscription plans for different team sizes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                For Social Media Managers
              </CardTitle>
              <CardDescription>
                Create engaging content faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Quick edits for multiple platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>AI understands context and brand guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Multiple format exports (JPG, PNG, WebP)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Track usage with detailed credit system</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by Google Gemini 2.5 Flash Image
          </p>
          <p className="text-xs text-muted-foreground italic">
            Independent platform, not affiliated with Google or mentioned brands
          </p>
        </div>
      </div>
    </section>
  )
}

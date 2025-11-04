import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Editor } from "@/components/editor"
import { Showcase } from "@/components/showcase"
import { SocialProof } from "@/components/social-proof"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Editor />
      <Showcase />
      <SocialProof />
      <FAQ />
      <Footer />
    </main>
  )
}

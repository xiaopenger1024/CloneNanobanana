"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type PlanType = "monthly" | "yearly"

interface PricingTier {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  credits: number
  features: string[]
  popular?: boolean
  cta: string
  productId: string  // Creem uses product_id, not price_id
  comingSoon?: boolean  // Mark plans that are not yet available
}

// Product IDs from Creem Dashboard
// Get your product IDs at: https://dashboard.creem.io/products
const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    description: "Perfect for individuals and light users",
    monthlyPrice: 12,
    yearlyPrice: 144,
    credits: 1800,
    features: [
      "75 high-quality images/month",
      "All style templates included",
      "Standard generation speed",
      "Basic customer support",
      "JPG/PNG format downloads",
      "Commercial Use License"
    ],
    cta: "Get Started",
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID || "prod_10uRHGbIe2Q2b3IRYrikDB"  // Active: $12/month plan
  },
  {
    name: "Pro",
    description: "For professional creators and teams",
    monthlyPrice: 19.5,
    yearlyPrice: 234,
    credits: 9600,
    features: [
      "400 high-quality images/month",
      "Support Seedream-4 Model",
      "Support Nanobanana-Pro Model",
      "All style templates included",
      "Priority generation queue",
      "Priority customer support",
      "JPG/PNG/WebP format downloads",
      "Batch generation feature",
      "Image editing tools",
      "Commercial Use License"
    ],
    popular: true,
    cta: "Coming Soon",
    productId: "pro_product_placeholder",  // TODO: Add product ID when ready
    comingSoon: true
  },
  {
    name: "Max",
    description: "Designed for large enterprises and professional studios",
    monthlyPrice: 80,
    yearlyPrice: 960,
    credits: 55200,
    features: [
      "2300 high-quality images/month",
      "Support Seedream-4 Model",
      "Support Nanobanana-Pro Model",
      "All style templates included",
      "Fastest generation speed",
      "Dedicated account manager",
      "All format downloads",
      "Batch generation feature",
      "Professional editing suite",
      "Commercial Use License"
    ],
    cta: "Coming Soon",
    productId: "max_product_placeholder",  // TODO: Add product ID when ready
    comingSoon: true
  }
]

export default function PricingPage() {
  const [billingType, setBillingType] = useState<PlanType>("yearly")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubscribe = async (tier: PricingTier) => {
    // Prevent interaction with coming soon plans
    if (tier.comingSoon) {
      return
    }

    setIsLoading(tier.name)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to home page to login
        router.push("/?login=true")
        return
      }

      // Call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: tier.productId,
          planName: tier.name,
          billingType,
          email: user.email
        })
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      // Redirect to Creem checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to create checkout session. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            🍌 Limited Time: Save 20% with Annual Billing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlimited creativity starts here
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-secondary rounded-lg">
            <button
              onClick={() => setBillingType("monthly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingType === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingType("yearly")}
              className={`px-6 py-2 rounded-md transition-colors relative ${
                billingType === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs">🔥 Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative ${
                tier.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              } ${tier.comingSoon ? "opacity-75" : ""}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              {tier.comingSoon && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary">
                    Coming Soon
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${billingType === "monthly" ? tier.monthlyPrice.toFixed(2) : (tier.yearlyPrice / 12).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {billingType === "yearly" && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ${tier.yearlyPrice.toFixed(2)}/year
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">
                    {tier.credits} credits/year
                  </div>
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier)}
                  disabled={isLoading !== null || tier.comingSoon}
                >
                  {isLoading === tier.name ? "Loading..." : tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">What are credits and how do they work?</h3>
              <p className="text-muted-foreground">
                2 credits generate 1 high-quality image. Credits are automatically refilled at the start of each billing cycle - monthly for monthly plans, all at once for yearly plans.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Do unused credits roll over?</h3>
              <p className="text-muted-foreground">
                Monthly plan credits do not roll over to the next month. Yearly plan credits are valid for the entire subscription period. We recommend choosing a plan based on your actual usage needs.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">What payment methods are supported?</h3>
              <p className="text-muted-foreground">
                We support credit cards, debit cards, and various other payment methods through our secure payment processor Creem.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Have more questions? We're here to help
            </p>
            <Button variant="outline" size="lg">
              Contact Support
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-16">
          Nanobanana.ai is an independent product and is not affiliated with Google or any of its brands
        </p>
      </div>
    </div>
    <Footer />
    </>
  )
}

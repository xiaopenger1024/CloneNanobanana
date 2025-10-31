"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, Crown, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Get all parameters from Creem
  // After successful payment, Creem redirects with: checkout_id, order_id, customer_id, subscription_id
  const checkoutId = searchParams.get("checkout_id")
  const orderId = searchParams.get("order_id")
  const customerId = searchParams.get("customer_id")
  const subscriptionId = searchParams.get("subscription_id")

  useEffect(() => {
    // Verify we have a valid payment confirmation
    // Creem always provides checkout_id and order_id on success
    if (!checkoutId && !orderId) {
      setError("Invalid payment confirmation. Please contact support if you completed a payment.")
      setLoading(false)
      return
    }

    // Verify user is logged in and update payment status
    const verifyPayment = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError("Please sign in to verify your payment.")
          setLoading(false)
          return
        }

        // Update user payment status (mark as paid)
        const response = await fetch('/api/usage', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_paid: true,
            order_id: orderId,
            checkout_id: checkoutId,
            customer_id: customerId,
            subscription_id: subscriptionId,
          }),
        })

        if (!response.ok) {
          console.error("Failed to update payment status:", await response.text())
        }

        // Wait a bit to show processing animation
        setTimeout(() => {
          setLoading(false)
        }, 2000)
      } catch (err) {
        console.error("Payment verification error:", err)
        setLoading(false)
      }
    }

    verifyPayment()
  }, [checkoutId, orderId, supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment and activate your subscription
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="text-6xl mb-4 opacity-20">⚠️</div>
            </div>
            <CardTitle className="text-2xl mb-2">Payment Verification Issue</CardTitle>
            <CardDescription className="text-base">
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => router.push("/")}
            >
              Return to Home
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/pricing")}
            >
              View Pricing
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
            <Crown className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
          </div>
          <CardTitle className="text-3xl mb-2">🎉 Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Welcome to Nano Banana Premium
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <p className="text-center text-lg font-medium text-green-900 dark:text-green-100 mb-2">
              🎊 Congratulations! Your subscription is now active
            </p>
            <p className="text-center text-sm text-green-700 dark:text-green-300">
              You can now enjoy unlimited AI image generation and all premium features
            </p>
          </div>

          {/* Features Unlocked */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Your Premium Benefits
            </h3>
            <div className="space-y-2 pl-7">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Unlimited Image Generation</strong> - Create as many AI images as you want
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>All Style Templates</strong> - Access to every style and effect
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Priority Processing</strong> - Faster image generation speed
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Commercial License</strong> - Use generated images commercially
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>Priority Support</strong> - Get help when you need it
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          {orderId && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Order Details</p>
              <div className="space-y-1">
                {orderId && (
                  <p className="text-xs">
                    <span className="text-muted-foreground">Order ID:</span>{" "}
                    <span className="font-mono">{orderId}</span>
                  </p>
                )}
                {checkoutId && (
                  <p className="text-xs">
                    <span className="text-muted-foreground">Checkout ID:</span>{" "}
                    <span className="font-mono">{checkoutId}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email Notification */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
              <span className="text-lg">📧</span>
              <span>
                A confirmation email has been sent with your subscription details and receipt.
              </span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
            onClick={() => router.push("/#editor")}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Creating Images Now
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Mail, CheckCircle, AlertCircle } from "lucide-react"

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              Customer Protection
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Refund Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Fair and transparent refund terms
            </p>
          </div>

          {/* Response Time Commitment */}
          <Card className="mb-8 border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Response Time Commitment</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our guarantee to you
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">
                We will respond to all refund requests within <span className="text-primary">3 business days</span>.
              </p>
              <p className="text-sm text-muted-foreground">
                This is our commitment to providing excellent customer service. Every inquiry will receive a prompt and fair response.
              </p>
            </CardContent>
          </Card>

          {/* Refund Eligibility */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Refund Eligibility</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <CardTitle>Subscription Cancellations</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>7-Day Money-Back Guarantee:</strong> Full refund available within 7 days of initial purchase</li>
                    <li>• <strong>Annual Plans:</strong> Pro-rated refunds based on unused months</li>
                    <li>• <strong>Monthly Plans:</strong> Cancel anytime, no further charges after current billing cycle</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <CardTitle>Service Issues</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Technical Problems:</strong> Full refund if we cannot resolve technical issues affecting your service</li>
                    <li>• <strong>Failed Generations:</strong> No credits deducted for failed image generations</li>
                    <li>• <strong>Service Outages:</strong> Pro-rated credit for extended downtime</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mt-1" />
                    <div>
                      <CardTitle>Unused Credits</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Annual Plans:</strong> Pro-rated refunds available for unused credits</li>
                    <li>• <strong>Monthly Plans:</strong> Credits are non-refundable but valid until end of billing cycle</li>
                    <li>• <strong>Partial Usage:</strong> Refunds calculated based on credits consumed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How to Request */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How to Request a Refund</h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <CardTitle>Email Our Support Team</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Send an email to:</p>
                    <a
                      href="mailto:nanobanana@xiaopeng.space"
                      className="text-primary hover:underline text-lg font-medium"
                    >
                      nanobanana@xiaopeng.space
                    </a>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Subject Line:</p>
                    <code className="bg-secondary px-3 py-1 rounded text-sm">
                      Refund Request - [Your Order ID]
                    </code>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Please Include:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Your account email address</li>
                      <li>• Order ID or subscription ID</li>
                      <li>• Reason for refund request</li>
                      <li>• Any relevant screenshots or details</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Time */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Processing Time</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Review (Within 3 Business Days)</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll review your request and respond with our decision
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Approval (2 Business Days)</h3>
                  <p className="text-sm text-muted-foreground">
                    Once approved, we'll process your refund
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Refund Processing (5-10 Business Days)</h3>
                  <p className="text-sm text-muted-foreground">
                    Refund will appear in your original payment method (timing depends on your bank or card issuer)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2 text-center">Questions About Refunds?</h3>
              <p className="text-center text-muted-foreground mb-4">
                Contact our support team for assistance
              </p>
              <div className="text-center">
                <a
                  href="mailto:nanobanana@xiaopeng.space"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Last updated: November 3, 2025
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

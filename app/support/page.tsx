"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Clock, MessageCircle } from "lucide-react"

export default function SupportPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Support Center
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to help you succeed
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us your questions and we'll get back to you
                </p>
                <a
                  href="mailto:nanobanana@xiaopeng.space"
                  className="text-primary hover:underline font-medium"
                >
                  nanobanana@xiaopeng.space
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Our commitment to you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We respond to all inquiries within
                </p>
                <p className="text-2xl font-bold text-primary">
                  3 Business Days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Common Issues</CardTitle>
                <CardDescription>Quick answers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Check our FAQ section for instant help
                </p>
                <a
                  href="/#faq"
                  className="text-primary hover:underline font-medium"
                >
                  View FAQ →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Support Topics */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              What can we help you with?
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account & Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Subscription management and upgrades</li>
                    <li>• Payment issues and invoices</li>
                    <li>• Account settings and preferences</li>
                    <li>• Refund requests (see our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a>)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Image generation issues</li>
                    <li>• Credit usage questions</li>
                    <li>• Browser compatibility problems</li>
                    <li>• Authentication and login help</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feature Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Suggest new features</li>
                    <li>• Report bugs or issues</li>
                    <li>• Request integrations</li>
                    <li>• Provide feedback</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form Info */}
            <div className="mt-12 text-center bg-card p-8 rounded-lg border">
              <h3 className="text-2xl font-bold mb-4">Ready to reach out?</h3>
              <p className="text-muted-foreground mb-6">
                Email us with your question and we'll respond within 3 business days
              </p>
              <a
                href="mailto:nanobanana@xiaopeng.space"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Database, Mail, Globe } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              Your Privacy Matters
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              How we collect, use, and protect your information
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: November 3, 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Welcome to Nano Banana ("we," "our," or "us"). We are committed to protecting your privacy
                and handling your data in an open and transparent manner. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you use our AI image editing
                platform.
              </p>
              <p>
                <strong className="text-foreground">Important:</strong> Nano Banana is an independent platform
                that provides a custom user interface for Google's Gemini 2.5 Flash Image model. We are not
                affiliated with, endorsed by, or sponsored by Google or any AI model providers.
              </p>
              <p>
                By using our service, you agree to the collection and use of information in accordance with
                this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Information We Collect</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    1. Information You Provide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Account Information:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Email address (via OAuth providers: GitHub or Google)</li>
                      <li>Name and profile information from OAuth providers</li>
                      <li>Account preferences and settings</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Payment Information:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Payment data processed securely by Creem (our payment processor)</li>
                      <li>We do not store your credit card information</li>
                      <li>Subscription and billing history</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Content You Create:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Images you upload for editing</li>
                      <li>Text prompts and editing instructions</li>
                      <li>Generated images and editing history</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    2. Information Automatically Collected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Usage Data:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Number of images generated</li>
                      <li>Credit usage and balance</li>
                      <li>Feature usage patterns</li>
                      <li>Time and date of access</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Technical Data:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Operating system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">How We Use Your Information</h2>

            <Card>
              <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">We use the collected information for:</p>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Providing Services</p>
                      <p>Process your images, manage your account, and deliver AI editing functionality</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Payment Processing</p>
                      <p>Process subscriptions, manage credits, and handle billing through Creem</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Communication</p>
                      <p>Send service updates, respond to inquiries, and provide customer support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Improvement and Analytics</p>
                      <p>Analyze usage patterns to improve our service and user experience</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Security and Fraud Prevention</p>
                      <p>Protect against unauthorized access, abuse, and fraudulent activities</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-foreground">Legal Compliance</p>
                      <p>Comply with legal obligations and enforce our terms of service</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Model Integration */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">AI Model Integration</h2>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Third-Party AI Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Important Disclosure:</strong> When you use our image
                  editing features, your images and prompts are processed through:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground">OpenRouter:</strong> Our API gateway that routes
                    requests to AI models
                  </li>
                  <li>
                    <strong className="text-foreground">Google Gemini 2.5 Flash Image:</strong> The underlying
                    AI model that performs image generation and editing
                  </li>
                </ul>
                <p className="bg-secondary/50 p-4 rounded-lg">
                  <strong className="text-foreground">Data Processing:</strong> Your images and prompts are
                  temporarily processed by these services to generate results. We recommend reviewing:
                  <br />
                  • <a href="https://openrouter.ai/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenRouter Privacy Policy</a>
                  <br />
                  • <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                </p>
                <p>
                  We are an independent service and not affiliated with these providers. Please review their
                  privacy policies to understand how they handle data.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Sharing */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">How We Share Your Information</h2>

            <Card>
              <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">We may share your information with:</p>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">Service Providers:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      <li>Creem (payment processing)</li>
                      <li>OpenRouter (AI model routing)</li>
                      <li>Google Gemini (AI image processing)</li>
                      <li>Supabase (authentication and database hosting)</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">Legal Requirements:</p>
                    <p>When required by law, court order, or legal process</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">Business Transfers:</p>
                    <p>In connection with a merger, acquisition, or sale of assets</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">With Your Consent:</p>
                    <p>When you explicitly consent to share information</p>
                  </div>
                </div>

                <p className="bg-secondary/50 p-4 rounded-lg mt-4">
                  <strong className="text-foreground">We do not:</strong> Sell your personal information to
                  third parties or use your images for training AI models without explicit consent.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Data Security</h2>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  How We Protect Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>We implement industry-standard security measures including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Encryption in transit (HTTPS/TLS)</li>
                  <li>Encrypted data storage</li>
                  <li>OAuth 2.0 authentication</li>
                  <li>Regular security audits</li>
                  <li>Access controls and monitoring</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                </ul>
                <p className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg mt-4">
                  <strong>Please Note:</strong> No method of transmission over the internet or electronic
                  storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute
                  security.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Your Rights */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Your Privacy Rights</h2>

            <Card>
              <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">You have the right to:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-1">Access</p>
                    <p>Request a copy of your personal data</p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-1">Correction</p>
                    <p>Update or correct inaccurate information</p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-1">Deletion</p>
                    <p>Request deletion of your account and data</p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-1">Portability</p>
                    <p>Export your data in a machine-readable format</p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-1">Objection</p>
                    <p>Object to certain data processing activities</p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-1">Withdraw Consent</p>
                    <p>Withdraw consent where applicable</p>
                  </div>
                </div>

                <p className="mt-4">
                  <strong className="text-foreground">To exercise your rights:</strong> Email us at{' '}
                  <a href="mailto:nanobanana@xiaopeng.space" className="text-primary hover:underline">
                    nanobanana@xiaopeng.space
                  </a>
                  {' '}with your request. We will respond within 30 days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Retention */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Data Retention</h2>

            <Card>
              <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">Specific Retention Periods:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Account Data:</strong> Until account deletion</li>
                  <li><strong className="text-foreground">Generated Images:</strong> 30 days after generation</li>
                  <li><strong className="text-foreground">Billing Records:</strong> 7 years (legal requirement)</li>
                  <li><strong className="text-foreground">Usage Logs:</strong> 90 days</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Children's Privacy</h2>

            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                <p>
                  Our service is not intended for children under 13 years of age. We do not knowingly collect
                  personal information from children under 13. If you are a parent or guardian and believe
                  your child has provided us with personal information, please contact us immediately.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* International Users */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">International Data Transfers</h2>

            <Card>
              <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
                <p>
                  Your information may be transferred to and processed in countries other than your country
                  of residence. These countries may have different data protection laws.
                </p>
                <p>
                  <strong className="text-foreground">Our Service Providers:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Supabase: United States</li>
                  <li>Creem: United States</li>
                  <li>OpenRouter: United States</li>
                  <li>Google Cloud: Global infrastructure</li>
                </ul>
                <p>
                  We ensure appropriate safeguards are in place to protect your data when it is transferred
                  internationally.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cookies and Tracking */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Cookies and Tracking Technologies</h2>

            <Card>
              <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
                <p>We use cookies and similar tracking technologies to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Maintain your login session</li>
                  <li>Remember your preferences</li>
                  <li>Analyze site usage and performance</li>
                  <li>Provide security features</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">Types of Cookies:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                  <li><strong>Authentication Cookies:</strong> Keep you signed in</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. Disabling essential cookies may
                  affect site functionality.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Changes to Policy */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Changes to This Privacy Policy</h2>

            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material changes
                  by:
                </p>
                <ul className="list-disc pl-5 space-y-1 my-3">
                  <li>Posting the updated policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending an email notification for significant changes</li>
                </ul>
                <p>
                  We encourage you to review this Privacy Policy periodically. Your continued use of our
                  service after changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Us */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                If you have questions or concerns about this Privacy Policy or our data practices, please
                contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong className="text-foreground">Email:</strong>{' '}
                  <a href="mailto:nanobanana@xiaopeng.space" className="text-primary hover:underline">
                    nanobanana@xiaopeng.space
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Support Center:</strong>{' '}
                  <a href="/support" className="text-primary hover:underline">
                    Visit our Support Page
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Response Time:</strong> We respond to all privacy
                  inquiries within 3 business days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <div className="mt-8 p-6 bg-secondary/30 rounded-lg text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Legal Information</p>
            <p className="mb-2">
              This Privacy Policy is governed by the laws of your jurisdiction. For users in the European
              Union, this policy complies with GDPR requirements. For California residents, this policy
              includes CCPA disclosures.
            </p>
            <p>
              <strong className="text-foreground">Effective Date:</strong> November 3, 2025
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

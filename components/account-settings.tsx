"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CreditCard, Calendar, Zap } from "lucide-react"

interface UsageData {
  canGenerate: boolean
  isAdmin: boolean
  isPaid: boolean
  remainingCredits: number
  totalCredits: number
  planName: string
  generationCount: number
}

export function AccountSettings() {
  const [loading, setLoading] = useState(true)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Fetch usage data
        const response = await fetch("/api/usage")
        if (response.ok) {
          const data = await response.json()
          setUsageData(data)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleManageSubscription = () => {
    // TODO: Implement Creem Customer Portal redirect
    // For now, redirect to pricing page
    window.location.href = "/pricing"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Authenticated</CardTitle>
          <CardDescription>Please sign in to view your account settings</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Created</label>
            <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Provider</label>
            <p className="text-lg capitalize">{user.app_metadata?.provider || "Unknown"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </div>
            {usageData?.isAdmin && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
                Admin
              </Badge>
            )}
            {usageData?.isPaid && !usageData?.isAdmin && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                Active
              </Badge>
            )}
            {!usageData?.isPaid && !usageData?.isAdmin && (
              <Badge variant="secondary">Free Trial</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="text-xl font-bold">{usageData?.planName || "Free Trial"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits</p>
                <p className="text-xl font-bold">
                  {usageData?.isAdmin ? "Unlimited" : `${usageData?.remainingCredits} / ${usageData?.totalCredits}`}
                </p>
              </div>
            </div>
          </div>

          {usageData?.isPaid && !usageData?.isAdmin && (
            <div className="pt-4 border-t">
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Cancel, upgrade, or update your subscription
              </p>
            </div>
          )}

          {!usageData?.isPaid && !usageData?.isAdmin && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => window.location.href = "/pricing"}
                className="w-full"
              >
                Upgrade to Pro
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Get more credits and unlock advanced features
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Your generation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Generations</p>
              <p className="text-2xl font-bold">{usageData?.generationCount || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Get support from our team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Have questions about your account or subscription? We're here to help within 3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => window.location.href = "/support"}>
              Visit Support Center
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "mailto:nanobanana@xiaopeng.space"}>
              Email Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

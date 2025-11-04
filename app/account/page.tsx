"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AccountSettings } from "@/components/account-settings"

export default function AccountPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and subscription
            </p>
          </div>

          {/* Account Settings Component */}
          <AccountSettings />
        </div>
      </div>
      <Footer />
    </>
  )
}

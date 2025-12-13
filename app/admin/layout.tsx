import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar user={user} />
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

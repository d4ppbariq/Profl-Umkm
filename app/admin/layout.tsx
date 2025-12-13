import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return <AdminLayoutWrapper user={user}>{children}</AdminLayoutWrapper>
}
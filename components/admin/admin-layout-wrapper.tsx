"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
  user: {
    nama: string
    role: string
  }
}

export function AdminLayoutWrapper({ children, user }: AdminLayoutWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Jika mobile, default sidebar tertutup. Jika desktop, default terbuka.
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    // Cek saat mount
    checkMobile()
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Optional: Auto collapse/expand on resize if needed, but keeping state is usually better UX
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Global Header with Hamburger - Visible on ALL screens now */}
      <div className="sticky top-0 z-50 flex h-16 items-center border-b border-border bg-card px-4 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="-ml-2 mr-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <span className="font-semibold text-lg">Admin Panel</span>
      </div>

      <AdminSidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
        className="pt-16" // Add padding top to account for the sticky header
      />
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={cn(
          "transition-[padding] duration-300 ease-in-out",
          // Desktop styles: adjust padding based on sidebar state
          // Note: Since sidebar is fixed left, we need to push content.
          // If sidebar is collapsed (w-20 on desktop), padding is pl-20.
          // If sidebar is open (w-64 on desktop), padding is pl-64.
          !isMobile && (isSidebarOpen ? "pl-64" : "pl-20"),
          
          // Mobile styles: no padding shift needed as sidebar is overlay
          isMobile && "pl-0"
        )}
      >
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
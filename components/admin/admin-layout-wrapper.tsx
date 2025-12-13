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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }
    
    checkMobile()
    
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop: Sidebar selalu terbuka (true)
  // Mobile: Sidebar mengikuti state toggle
  const sidebarOpenState = isMobile ? isSidebarOpen : true

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Global Header: Hanya Tampil di Mobile (md:hidden) 
          Ini menghapus header putih "Admin Panel" di desktop */}
      <div className="sticky top-0 z-50 flex h-16 items-center border-b border-border bg-card px-4 shadow-sm md:hidden">
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
        isOpen={sidebarOpenState} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
        // Hapus padding-top di desktop karena navbar atas hilang, tapi tetap ada di mobile
        className={cn("transition-all", isMobile ? "pt-16" : "pt-0")}
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
          // Desktop: Padding kiri 64 (lebar sidebar)
          "md:pl-64",
          // Mobile: Padding 0 (sidebar overlay)
          "pl-0"
        )}
      >
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
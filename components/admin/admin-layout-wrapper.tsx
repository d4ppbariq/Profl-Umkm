"use client"

import * as React from "react"
import { AdminSidebar } from "./sidebar"
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
      {/* Header putih (sticky navbar) telah dihapus sesuai permintaan.
          Tombol menu sekarang dipindahkan ke dalam area konten utama.
      */}

      <AdminSidebar 
        user={user} 
        isOpen={sidebarOpenState} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
        className="transition-all pt-0" // Reset padding karena header dihapus
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
          // Mobile: Padding 0
          "pl-0"
        )}
      >
        <main className="p-4 md:p-8">
          {/* Tombol Toggle Menu Khusus Mobile */}
          <div className="mb-4 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-card shadow-sm border-border h-10 w-10"
              aria-label="Buka Menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </Button>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  )
}
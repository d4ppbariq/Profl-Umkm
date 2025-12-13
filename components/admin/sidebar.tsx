"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Store, 
  Tags, 
  Users, 
  LogOut,
  X
} from "lucide-react"

interface SidebarProps {
  user: {
    nama: string
    role: string
  }
  isOpen: boolean
  toggle: () => void
  isMobile?: boolean
  onClose?: () => void
  className?: string
}

export function AdminSidebar({ user, isOpen, isMobile, onClose, className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/umkm",
      label: "Kelola UMKM",
      icon: Store,
    },
    {
      href: "/admin/kategori",
      label: "Kelola Kategori",
      icon: Tags,
    },
  ]

  if (user.role === "SUPER_ADMIN") {
    menuItems.push({
      href: "/admin/pengguna",
      label: "Kelola Admin",
      icon: Users,
    })
  }

  const showContent = isMobile ? true : isOpen

  return (
    <aside 
      className={cn(
        // Desain: Background Hijau (Primary) dengan teks Putih
        // Menggunakan bg-primary dan text-primary-foreground sesuai tema
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-primary text-primary-foreground border-r border-primary-foreground/10 transition-all duration-300 ease-in-out shadow-xl",
        className,
        isOpen ? "w-64 translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Tombol Close hanya untuk Mobile */}
      {isMobile && (
        <div className="absolute right-2 top-4 md:hidden z-50">
             <button 
                onClick={onClose} 
                className="p-2 text-primary-foreground/80 hover:text-white transition-colors"
                type="button"
             >
                <X className="h-5 w-5" />
             </button>
        </div>
      )}

      {/* Header Sidebar: Logo/Judul */}
      <div className={cn("flex h-16 items-center px-6 border-b border-primary-foreground/10", !showContent && "justify-center px-2")}>
        {showContent ? (
           <div className="flex items-center gap-2">
             {/* Logo Box: Putih dengan teks Hijau */}
             <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary font-bold shadow-sm">
               DC
             </div>
             <h2 className="text-lg font-bold tracking-tight text-white">Admin Panel</h2>
           </div>
        ) : (
           <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary font-bold shadow-sm">
             DC
           </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4 overflow-x-hidden mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group",
                
                // Styling Menu:
                // Active: Background Putih, Teks Hijau
                // Inactive: Teks Putih transparan, Hover jadi Background Putih & Teks Hijau
                isActive
                  ? "bg-white text-primary shadow-md translate-x-1"
                  : "text-primary-foreground/90 hover:bg-white hover:text-primary hover:shadow-sm hover:translate-x-1",
                  
                !showContent && "justify-center"
              )}
              title={!showContent ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", 
                // Icon mengikuti warna teks
                isActive ? "text-primary" : "text-primary-foreground/80 group-hover:text-primary"
              )} />
              
              {showContent && (
                <span className="whitespace-nowrap flex-1">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Sidebar: Profil Admin */}
      <div className="border-t border-primary-foreground/10 bg-primary-foreground/5 p-4">
        <div className={cn("mb-3 flex items-center gap-3", !showContent && "justify-center")}>
          {/* Avatar: Background Putih, Teks Hijau */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary ring-2 ring-white/20">
            <span className="text-sm font-bold">{user.nama.charAt(0).toUpperCase()}</span>
          </div>
          {showContent && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white">{user.nama}</p>
              <p className="text-xs text-primary-foreground/80 truncate">
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-destructive hover:border-white shadow-sm group",
            !showContent && "justify-center"
          )}
          title={!showContent ? "Keluar" : undefined}
          type="button"
        >
          <LogOut className="h-4 w-4 shrink-0 group-hover:text-destructive" />
          {showContent && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  )
}
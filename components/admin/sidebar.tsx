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
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  // Menutup sidebar saat link diklik pada mode mobile
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

  // Logika tampilan konten:
  // Mobile: Sidebar tersembunyi jika !isOpen (diatur via translate). Jika Open, konten muncul.
  // Desktop: Sidebar selalu muncul. Lebar diatur di parent/wrapper, tapi konten di sini menyesuaikan.
  // Karena user minta "hanya hamburger", kita asumsikan kontrol penuh ada di hamburger.
  const showContent = isMobile ? true : isOpen

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-accent text-primary-foreground transition-all duration-300 ease-in-out",
        className,
        
        // Logic Lebar:
        // Mobile: Selalu w-64 (full drawer)
        // Desktop: w-64 jika open, w-0 atau hidden jika closed (tergantung preferensi, tapi biasanya sidebar admin toggle jadi nol atau mini)
        // Disini kita buat w-64 saat open. Saat closed di desktop, wrapper akan mengatur margin, 
        // tapi sidebar sendiri bisa kita translate keluar agar rapi.
        isOpen ? "w-64 translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Tombol Close khusus Mobile (Opsional, untuk kemudahan akses) */}
      {isMobile && (
        <div className="absolute right-2 top-4 md:hidden">
             <button onClick={onClose} className="p-2 text-primary-foreground/70 hover:text-primary-foreground">
                <X className="h-5 w-5" />
             </button>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-4 overflow-x-hidden mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative group",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
              !showContent && "justify-center"
            )}
            title={!showContent ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-primary-foreground/10 p-4">
        <div className={cn("mb-3 flex items-center gap-3", !showContent && "justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 text-sm font-medium">
            {user.nama.charAt(0).toUpperCase()}
          </div>
          {showContent && (
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{user.nama}</p>
              <p className="text-xs text-primary-foreground/60">
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20",
            !showContent && "justify-center"
          )}
          title={!showContent ? "Keluar" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
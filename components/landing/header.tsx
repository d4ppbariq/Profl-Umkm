"use client"

import * as React from "react"
import { Menu, X, Store } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  // Efek untuk mendeteksi scroll agar navbar berubah style
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm" 
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Store className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">
              UMKM
            </span>
            <span className="text-xs font-medium text-muted-foreground">Desa Cikupa</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">Beranda</NavLink>
          <NavLink href="/umkm">Katalog UMKM</NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 md:hidden animate-in slide-in-from-top-5 fade-in duration-200">
          <nav className="flex flex-col space-y-2">
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Beranda</MobileNavLink>
            <MobileNavLink href="/umkm" onClick={() => setIsMenuOpen(false)}>Katalog UMKM</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {children}
    </a>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
      onClick={onClick}
    >
      {children}
    </a>
  )
}
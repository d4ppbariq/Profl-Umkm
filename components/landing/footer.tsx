import Link from "next/link"
import { Phone, MapPin, Mail, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Globe className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">UMKM Desa Cikupa</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Wadah digital untuk mempromosikan potensi dan produk unggulan UMKM Desa Cikupa, Karangnunggal, Tasikmalaya.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Menu Utama</h3>
            <ul className="space-y-3">
              <FooterLink href="/">Beranda</FooterLink>
              <FooterLink href="/umkm">Katalog UMKM</FooterLink>
            </ul>
          </div>

          {/* Kolom 3 & 4: Kontak & Alamat (Digabung di mobile, pisah di desktop) */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Hubungi Kami</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Alamat */}
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Kantor Desa Cikupa</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Jl. Raya Karangnunggal No. 123<br />
                    Kecamatan Karangnunggal<br />
                    Kabupaten Tasikmalaya 46186<br />
                    Jawa Barat, Indonesia
                  </p>
                </div>
              </div>

              {/* Kontak Digital */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" />
                  <a href="mailto:info@desacikupa.id" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    info@desacikupa.id
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  <a href="tel:+6281234567890" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              &copy; {new Date().getFullYear()} UMKM Desa Cikupa. Hak Cipta Dilindungi.
            </p>
            <p className="text-center text-sm text-muted-foreground sm:text-right flex items-center gap-1">
              Dibuat dengan <span className="text-red-500">♥</span> untuk kemajuan desa
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
      >
        {children}
      </Link>
    </li>
  )
}
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { UMKMCatalog } from "@/components/umkm/umkm-catalog"

export const metadata = {
  title: "Katalog UMKM - Desa Cikupa",
  description: "Jelajahi berbagai UMKM di Desa Cikupa, Karangnunggal, Tasikmalaya",
}

export default function UMKMPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Katalog UMKM</h1>
            <p className="mt-2 text-muted-foreground">
              Temukan berbagai usaha mikro, kecil, dan menengah di Desa Cikupa
            </p>
          </div>
          <UMKMCatalog />
        </div>
      </main>
      <Footer />
    </div>
  )
}

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const umkm = await prisma.uMKM.findUnique({ where: { id } })
  return {
    title: umkm ? `${umkm.namaUmkm} - UMKM Desa Cikupa` : "UMKM Tidak Ditemukan",
  }
}

export default async function UMKMDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const umkm = await prisma.uMKM.findUnique({
    where: { id },
    include: { kategori: true, gambar: true },
  })

  if (!umkm) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/umkm"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Katalog
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              {umkm.gambar.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={umkm.gambar[0].url || "/placeholder.svg"}
                      alt={umkm.namaUmkm}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {umkm.gambar.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {umkm.gambar.slice(1, 5).map((img) => (
                        <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={img.url || "/placeholder.svg"}
                            alt={umkm.namaUmkm}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border bg-muted">
                  <span className="text-muted-foreground">Belum ada gambar</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {umkm.kategori.map((kat) => (
                  <span key={kat.id} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {kat.nama}
                  </span>
                ))}
              </div>

              <h1 className="mb-4 text-3xl font-bold text-foreground">{umkm.namaUmkm}</h1>

              {umkm.deskripsi && <p className="mb-6 leading-relaxed text-muted-foreground">{umkm.deskripsi}</p>}

              <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                {umkm.alamatFisik && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-foreground">Alamat</p>
                      <p className="text-sm text-muted-foreground">{umkm.alamatFisik}</p>
                    </div>
                  </div>
                )}

                {umkm.kontakWhatsapp && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-foreground">WhatsApp</p>
                      <a
                        href={`https://wa.me/${umkm.kontakWhatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {umkm.kontakWhatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {umkm.urlGoogleMaps && (
                  <a
                    href={umkm.urlGoogleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Lihat di Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

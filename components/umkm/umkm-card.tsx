import Link from "next/link"
import Image from "next/image"

interface UMKMCardProps {
  id: string
  namaUmkm: string
  alamatFisik: string | null
  kategori: { id: string; nama: string }[]
  gambar: { id: string; url: string }[]
}

export function UMKMCard({ id, namaUmkm, alamatFisik, kategori, gambar }: UMKMCardProps) {
  return (
    <Link href={`/umkm/${id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-muted">
          {gambar.length > 0 ? (
            <Image
              src={gambar[0].url || "/placeholder.svg"}
              alt={namaUmkm}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-muted-foreground">Belum ada gambar</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary">
            {namaUmkm}
          </h3>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {kategori.map((kat) => (
              <span key={kat.id} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {kat.nama}
              </span>
            ))}
          </div>
          {alamatFisik && (
            <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span className="line-clamp-2">{alamatFisik}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

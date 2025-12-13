import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Desa Cikupa, Karangnunggal, Tasikmalaya
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Profil UMKM <span className="text-primary">Desa Cikupa</span>
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Sebanyak 300 pelaku Usaha Mikro Kecil Menengah (UMKM) di Desa Cikupa, Kecamatan Karangnunggal, Kabupaten
            Tasikmalaya menerima sertifikat tanah melalui program Sertifikat Hak Atas Tanah (SHAT).
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://tasikmalaya.inews.id/read/353964/300-pelaku-umkm-desa-cikupa-tasikmalaya-dapat-sertifikat-hak-atas-tanah-dari-disperindag-dan-bpn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-accent hover:shadow-xl hover:shadow-primary/30"
            >
              Baca Selengkapnya
            </a>
            <Link
              href="/umkm"
              className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 text-base font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Jelajahi UMKM
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
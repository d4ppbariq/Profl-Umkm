export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-foreground">UMKM Desa Cikupa</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Platform profil dan promosi UMKM Desa Cikupa, Kecamatan Karangnunggal, Kabupaten Tasikmalaya.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Navigasi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/umkm" className="text-muted-foreground transition-colors hover:text-primary">
                  Katalog UMKM
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Lokasi</h3>
            <address className="text-sm not-italic text-muted-foreground">
              Desa Cikupa
              <br />
              Kecamatan Karangnunggal
              <br />
              Kabupaten Tasikmalaya
              <br />
              Jawa Barat, Indonesia
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} UMKM Desa Cikupa. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  )
}
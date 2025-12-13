import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UMKM Desa Cikupa - Profil Usaha Mikro Kecil Menengah",
  description:
    "Platform profil dan promosi UMKM Desa Cikupa, Kecamatan Karangnunggal, Kabupaten Tasikmalaya. Temukan berbagai usaha lokal berkualitas.",
  generator: "v0.app",
  keywords: ["UMKM", "Desa Cikupa", "Karangnunggal", "Tasikmalaya", "usaha kecil", "usaha mikro"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Category {
  id: string
  nama: string
}

export default function TambahUMKMPage() {
  const router = useRouter()
  const { data: categories } = useSWR<Category[]>("/api/kategori", fetcher)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    namaUmkm: "",
    deskripsi: "",
    alamatFisik: "",
    urlGoogleMaps: "",
    kontakWhatsapp: "",
    kategoriIds: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal menambah UMKM")
        return
      }

      const umkm = await res.json()
      router.push(`/admin/umkm/${umkm.id}`)
    } catch {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const toggleKategori = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      kategoriIds: prev.kategoriIds.includes(id) ? prev.kategoriIds.filter((k) => k !== id) : [...prev.kategoriIds, id],
    }))
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/umkm"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Tambah UMKM</h1>
        <p className="text-muted-foreground">Isi data UMKM baru</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Informasi Dasar</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="namaUmkm">
                Nama UMKM <span className="text-destructive">*</span>
              </Label>
              <Input
                id="namaUmkm"
                value={formData.namaUmkm}
                onChange={(e) => setFormData({ ...formData, namaUmkm: e.target.value })}
                placeholder="Contoh: Warung Makan Bu Siti"
                required
                className="border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat tentang UMKM"
                rows={4}
                className="border-border focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Kategori</h2>
          {categories?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada kategori.{" "}
              <Link href="/admin/kategori" className="text-primary hover:underline">
                Tambah kategori
              </Link>{" "}
              terlebih dahulu.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {categories?.map((cat) => (
                <label
                  key={cat.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={formData.kategoriIds.includes(cat.id)}
                    onCheckedChange={() => toggleKategori(cat.id)}
                  />
                  <span className="text-sm font-medium text-foreground">{cat.nama}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Kontak & Lokasi</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alamatFisik">Alamat</Label>
              <Input
                id="alamatFisik"
                value={formData.alamatFisik}
                onChange={(e) => setFormData({ ...formData, alamatFisik: e.target.value })}
                placeholder="Alamat lengkap UMKM"
                className="border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlGoogleMaps">URL Google Maps</Label>
              <Input
                id="urlGoogleMaps"
                type="url"
                value={formData.urlGoogleMaps}
                onChange={(e) => setFormData({ ...formData, urlGoogleMaps: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kontakWhatsapp">Nomor WhatsApp</Label>
              <Input
                id="kontakWhatsapp"
                value={formData.kontakWhatsapp}
                onChange={(e) => setFormData({ ...formData, kontakWhatsapp: e.target.value })}
                placeholder="08123456789"
                className="border-border focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-accent">
            {loading ? "Menyimpan..." : "Simpan UMKM"}
          </Button>
          <Link href="/admin/umkm">
            <Button type="button" variant="outline" className="border-border bg-transparent">
              Batal
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

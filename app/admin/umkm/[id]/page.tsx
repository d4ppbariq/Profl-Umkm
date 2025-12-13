"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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

interface Gambar {
  id: string
  url: string
}

interface UMKM {
  id: string
  namaUmkm: string
  deskripsi: string | null
  alamatFisik: string | null
  urlGoogleMaps: string | null
  kontakWhatsapp: string | null
  kategori: Category[]
  gambar: Gambar[]
}

export default function EditUMKMPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  const { data: umkm, mutate } = useSWR<UMKM>(`/api/umkm/${id}`, fetcher)
  const { data: categories } = useSWR<Category[]>("/api/kategori", fetcher)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    namaUmkm: "",
    deskripsi: "",
    alamatFisik: "",
    urlGoogleMaps: "",
    kontakWhatsapp: "",
    kategoriIds: [] as string[],
  })

  useEffect(() => {
    if (umkm) {
      setFormData({
        namaUmkm: umkm.namaUmkm,
        deskripsi: umkm.deskripsi || "",
        alamatFisik: umkm.alamatFisik || "",
        urlGoogleMaps: umkm.urlGoogleMaps || "",
        kontakWhatsapp: umkm.kontakWhatsapp || "",
        kategoriIds: umkm.kategori.map((k) => k.id),
      })
    }
  }, [umkm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`/api/umkm/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal mengupdate UMKM")
        return
      }

      mutate()
      router.push("/admin/umkm")
    } catch {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      await fetch(`/api/umkm/${id}/gambar`, {
        method: "POST",
        body: formDataUpload,
      })
      mutate()
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (gambarId: string, url: string) => {
    try {
      await fetch(`/api/umkm/${id}/gambar`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gambarId, url }),
      })
      mutate()
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const toggleKategori = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      kategoriIds: prev.kategoriIds.includes(catId)
        ? prev.kategoriIds.filter((k) => k !== catId)
        : [...prev.kategoriIds, catId],
    }))
  }

  if (!umkm) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
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
        <h1 className="text-2xl font-bold text-foreground">Edit UMKM</h1>
        <p className="text-muted-foreground">Update data UMKM</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
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
                  rows={4}
                  className="border-border focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Kategori</h2>
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
                  className="border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kontakWhatsapp">Nomor WhatsApp</Label>
                <Input
                  id="kontakWhatsapp"
                  value={formData.kontakWhatsapp}
                  onChange={(e) => setFormData({ ...formData, kontakWhatsapp: e.target.value })}
                  className="border-border focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-accent">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Link href="/admin/umkm">
              <Button type="button" variant="outline" className="border-border bg-transparent">
                Batal
              </Button>
            </Link>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Gambar</h2>

            <div className="space-y-4">
              {umkm.gambar.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada gambar</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {umkm.gambar.map((img) => (
                    <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image src={img.url || "/placeholder.svg"} alt="UMKM" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id, img.url)}
                        className="absolute right-1 top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                  id="upload-image"
                />
                <label
                  htmlFor="upload-image"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {uploading ? (
                    "Mengupload..."
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload Gambar
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

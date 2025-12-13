"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Category {
  id: string
  nama: string
  _count: { umkm: number }
}

export default function AdminKategoriPage() {
  const { data: categories, mutate, isLoading } = useSWR<Category[]>("/api/kategori", fetcher)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [nama, setNama] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setNama(category.nama)
    } else {
      setEditingCategory(null)
      setNama("")
    }
    setError("")
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = editingCategory ? `/api/kategori/${editingCategory.id}` : "/api/kategori"
      const method = editingCategory ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal menyimpan kategori")
        return
      }

      mutate()
      setIsDialogOpen(false)
    } catch {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    await fetch(`/api/kategori/${deleteId}`, { method: "DELETE" })
    mutate()
    setDeleteId(null)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Kategori</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus kategori UMKM</p>
        </div>
        <Button onClick={() => handleOpen()} className="bg-primary hover:bg-accent">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kategori
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nama Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Jumlah UMKM</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={3} className="px-6 py-4">
                      <div className="h-5 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : categories?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    Belum ada kategori
                  </td>
                </tr>
              ) : (
                categories?.map((cat) => (
                  <tr key={cat.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {cat.nama}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{cat._count.umkm} UMKM</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpen(cat)}
                          className="border-border bg-transparent"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(cat.id)}
                          disabled={cat._count.umkm > 0}
                          className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent disabled:opacity-50"
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
            <Input
              placeholder="Nama kategori"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="border-border focus-visible:ring-primary"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-border bg-transparent"
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-accent">
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kategori akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

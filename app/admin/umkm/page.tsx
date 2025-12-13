"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface UMKM {
  id: string
  namaUmkm: string
  alamatFisik: string | null
  kategori: { id: string; nama: string }[]
}

export default function AdminUMKMPage() {
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data: umkmList, mutate, isLoading } = useSWR<UMKM[]>("/api/umkm", fetcher)

  const handleDelete = async () => {
    if (!deleteId) return

    await fetch(`/api/umkm/${deleteId}`, { method: "DELETE" })
    mutate()
    setDeleteId(null)
  }

  const filteredUmkm = umkmList?.filter((umkm) => umkm.namaUmkm.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola UMKM</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus data UMKM</p>
        </div>
        <Link href="/admin/umkm/tambah">
          <Button className="bg-primary hover:bg-accent">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah UMKM
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Cari UMKM..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border-border focus-visible:ring-primary"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nama UMKM</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Alamat</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="h-5 animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : filteredUmkm?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Belum ada UMKM terdaftar
                  </td>
                </tr>
              ) : (
                filteredUmkm?.map((umkm) => (
                  <tr key={umkm.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{umkm.namaUmkm}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {umkm.kategori.map((kat) => (
                          <span
                            key={kat.id}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {kat.nama}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{umkm.alamatFisik || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/umkm/${umkm.id}`}>
                          <Button variant="outline" size="sm" className="border-border bg-transparent">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                          onClick={() => setDeleteId(umkm.id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus UMKM?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data UMKM beserta gambar akan dihapus permanen.
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

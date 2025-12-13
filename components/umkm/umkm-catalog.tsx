"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { UMKMCard } from "./umkm-card"
import { CategoryFilter } from "./category-filter"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function UMKMCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: categories } = useSWR("/api/kategori", fetcher)

  const params = new URLSearchParams()
  if (selectedCategory) params.set("kategori", selectedCategory)
  if (debouncedSearch) params.set("search", debouncedSearch)

  const { data: umkmList, isLoading } = useSWR(`/api/umkm?${params.toString()}`, fetcher)

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar Filter */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
          <div className="mb-6">
            <label htmlFor="search" className="mb-2 block text-sm font-semibold text-foreground">
              Cari UMKM
            </label>
            <Input
              id="search"
              type="search"
              placeholder="Nama UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border focus-visible:ring-primary"
            />
          </div>
          {categories && (
            <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
          )}
        </div>
      </aside>

      {/* UMKM Grid */}
      <div className="flex-1">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : umkmList?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <svg className="mb-4 h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-muted-foreground">Belum ada UMKM terdaftar</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {umkmList?.map((umkm: Record<string, unknown>) => (
              <UMKMCard
                key={umkm.id as string}
                id={umkm.id as string}
                namaUmkm={umkm.namaUmkm as string}
                alamatFisik={umkm.alamatFisik as string | null}
                kategori={umkm.kategori as { id: string; nama: string }[]}
                gambar={umkm.gambar as { id: string; url: string }[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

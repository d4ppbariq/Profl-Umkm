"use client"

import { cn } from "@/lib/utils"

interface Category {
  id: string
  nama: string
  _count: { umkm: number }
}

interface CategoryFilterProps {
  categories: Category[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Filter Kategori</h3>
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
          selected === null ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
        )}
      >
        <span>Semua Kategori</span>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
            selected === category.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <span>{category.nama}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              selected === category.id
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {category._count.umkm}
          </span>
        </button>
      ))}
    </div>
  )
}

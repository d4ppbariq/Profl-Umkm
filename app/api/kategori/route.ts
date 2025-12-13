import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const kategori = await prisma.kategoriUMKM.findMany({
      orderBy: { nama: "asc" },
      include: {
        _count: {
          select: { umkm: true },
        },
      },
    })

    return NextResponse.json(kategori)
  } catch (error) {
    console.error("Error fetching kategori:", error)
    return NextResponse.json({ error: "Failed to fetch kategori" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { nama } = await request.json()

    if (!nama) {
      return NextResponse.json({ error: "Nama kategori harus diisi" }, { status: 400 })
    }

    const existing = await prisma.kategoriUMKM.findUnique({ where: { nama } })
    if (existing) {
      return NextResponse.json({ error: "Kategori sudah ada" }, { status: 400 })
    }

    const kategori = await prisma.kategoriUMKM.create({
      data: { nama },
    })

    return NextResponse.json(kategori, { status: 201 })
  } catch (error) {
    console.error("Error creating kategori:", error)
    return NextResponse.json({ error: "Failed to create kategori" }, { status: 500 })
  }
}

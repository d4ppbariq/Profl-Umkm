import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kategoriId = searchParams.get("kategori")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}

    if (kategoriId) {
      where.kategori = {
        some: { id: kategoriId },
      }
    }

    if (search) {
      where.namaUmkm = {
        contains: search,
        mode: "insensitive",
      }
    }

    const umkm = await prisma.uMKM.findMany({
      where,
      include: {
        kategori: true,
        gambar: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(umkm)
  } catch (error) {
    console.error("Error fetching UMKM:", error)
    return NextResponse.json({ error: "Failed to fetch UMKM" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { namaUmkm, deskripsi, alamatFisik, urlGoogleMaps, kontakWhatsapp, kategoriIds } = body

    if (!namaUmkm) {
      return NextResponse.json({ error: "Nama UMKM harus diisi" }, { status: 400 })
    }

    const umkm = await prisma.uMKM.create({
      data: {
        namaUmkm,
        deskripsi: deskripsi || null,
        alamatFisik: alamatFisik || null,
        urlGoogleMaps: urlGoogleMaps || null,
        kontakWhatsapp: kontakWhatsapp || null,
        kategori: kategoriIds?.length
          ? {
              connect: kategoriIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { kategori: true, gambar: true },
    })

    return NextResponse.json(umkm, { status: 201 })
  } catch (error) {
    console.error("Error creating UMKM:", error)
    return NextResponse.json({ error: "Failed to create UMKM" }, { status: 500 })
  }
}

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const umkm = await prisma.uMKM.findUnique({
      where: { id },
      include: { kategori: true, gambar: true },
    })

    if (!umkm) {
      return NextResponse.json({ error: "UMKM not found" }, { status: 404 })
    }

    return NextResponse.json(umkm)
  } catch (error) {
    console.error("Error fetching UMKM:", error)
    return NextResponse.json({ error: "Failed to fetch UMKM" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { namaUmkm, deskripsi, alamatFisik, urlGoogleMaps, kontakWhatsapp, kategoriIds } = body

    if (!namaUmkm) {
      return NextResponse.json({ error: "Nama UMKM harus diisi" }, { status: 400 })
    }

    const umkm = await prisma.uMKM.update({
      where: { id },
      data: {
        namaUmkm,
        deskripsi: deskripsi || null,
        alamatFisik: alamatFisik || null,
        urlGoogleMaps: urlGoogleMaps || null,
        kontakWhatsapp: kontakWhatsapp || null,
        kategori: {
          set: kategoriIds?.map((catId: string) => ({ id: catId })) || [],
        },
      },
      include: { kategori: true, gambar: true },
    })

    return NextResponse.json(umkm)
  } catch (error) {
    console.error("Error updating UMKM:", error)
    return NextResponse.json({ error: "Failed to update UMKM" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.uMKM.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting UMKM:", error)
    return NextResponse.json({ error: "Failed to delete UMKM" }, { status: 500 })
  }
}

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { nama } = await request.json()

    if (!nama) {
      return NextResponse.json({ error: "Nama kategori harus diisi" }, { status: 400 })
    }

    const existing = await prisma.kategoriUMKM.findFirst({
      where: { nama, NOT: { id } },
    })
    if (existing) {
      return NextResponse.json({ error: "Kategori sudah ada" }, { status: 400 })
    }

    const kategori = await prisma.kategoriUMKM.update({
      where: { id },
      data: { nama },
    })

    return NextResponse.json(kategori)
  } catch (error) {
    console.error("Error updating kategori:", error)
    return NextResponse.json({ error: "Failed to update kategori" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.kategoriUMKM.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting kategori:", error)
    return NextResponse.json({ error: "Failed to delete kategori" }, { status: 500 })
  }
}

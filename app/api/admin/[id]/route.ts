import { prisma } from "@/lib/db"
import { getSession, hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { email, password, nama } = await request.json()

    if (!email || !nama) {
      return NextResponse.json({ error: "Email dan nama harus diisi" }, { status: 400 })
    }

    const existing = await prisma.pengguna.findFirst({
      where: { email, NOT: { id } },
    })
    if (existing) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { email, nama }
    if (password) {
      updateData.password = await hashPassword(password)
    }

    const admin = await prisma.pengguna.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, nama: true, createdAt: true },
    })

    return NextResponse.json(admin)
  } catch (error) {
    console.error("Error updating admin:", error)
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.pengguna.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting admin:", error)
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 })
  }
}

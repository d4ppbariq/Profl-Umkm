import { prisma } from "@/lib/db"
import { getSession, hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getSession()
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admins = await prisma.pengguna.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, nama: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(admins)
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, password, nama } = await request.json()

    if (!email || !password || !nama) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    const existing = await prisma.pengguna.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const admin = await prisma.pengguna.create({
      data: {
        email,
        password: hashedPassword,
        nama,
        role: "ADMIN",
      },
      select: { id: true, email: true, nama: true, createdAt: true },
    })

    return NextResponse.json(admin, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}

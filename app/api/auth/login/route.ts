import { prisma } from "@/lib/db"
import { verifyPassword, createToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    const user = await prisma.pengguna.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const token = await createToken({ userId: user.id, role: user.role })

    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email, nama: user.nama, role: user.role },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 })
  }
}

import { cookies } from "next/headers"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "umkm-desa-cikupa-secret-key-2024")

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; role: string }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  const user = await prisma.pengguna.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, nama: true, role: true },
  })

  return user
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

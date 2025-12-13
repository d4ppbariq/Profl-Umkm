import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { put, del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`umkm/${id}/${file.name}`, file, { access: "public" })

    // Save URL to database
    const gambar = await prisma.gambarUMKM.create({
      data: {
        url: blob.url,
        umkmId: id,
      },
    })

    return NextResponse.json(gambar, { status: 201 })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gambarId, url } = await request.json()

    // Delete from Vercel Blob
    await del(url)

    // Delete from database
    await prisma.gambarUMKM.delete({ where: { id: gambarId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}

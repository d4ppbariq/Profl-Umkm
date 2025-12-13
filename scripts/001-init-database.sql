-- Create enum for roles
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- Create Pengguna table
CREATE TABLE "Pengguna" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("id")
);

-- Create KategoriUMKM table
CREATE TABLE "KategoriUMKM" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KategoriUMKM_pkey" PRIMARY KEY ("id")
);

-- Create UMKM table
CREATE TABLE "UMKM" (
    "id" TEXT NOT NULL,
    "namaUmkm" TEXT NOT NULL,
    "deskripsi" TEXT,
    "alamatFisik" TEXT,
    "urlGoogleMaps" TEXT,
    "kontakWhatsapp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UMKM_pkey" PRIMARY KEY ("id")
);

-- Create GambarUMKM table
CREATE TABLE "GambarUMKM" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "umkmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GambarUMKM_pkey" PRIMARY KEY ("id")
);

-- Create junction table for UMKM-Kategori many-to-many
CREATE TABLE "_UMKMKategori" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");
CREATE UNIQUE INDEX "KategoriUMKM_nama_key" ON "KategoriUMKM"("nama");
CREATE UNIQUE INDEX "_UMKMKategori_AB_unique" ON "_UMKMKategori"("A", "B");
CREATE INDEX "_UMKMKategori_B_index" ON "_UMKMKategori"("B");

-- Add foreign key constraints
ALTER TABLE "GambarUMKM" ADD CONSTRAINT "GambarUMKM_umkmId_fkey" FOREIGN KEY ("umkmId") REFERENCES "UMKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_UMKMKategori" ADD CONSTRAINT "_UMKMKategori_A_fkey" FOREIGN KEY ("A") REFERENCES "KategoriUMKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_UMKMKategori" ADD CONSTRAINT "_UMKMKategori_B_fkey" FOREIGN KEY ("B") REFERENCES "UMKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

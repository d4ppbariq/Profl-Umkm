-- Insert Super Admin (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO "Pengguna" ("id", "email", "password", "nama", "role", "createdAt", "updatedAt")
VALUES (
    'clsuperadmin001',
    'superadmin@desacikupa.id',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4IwJYKJJGQEGJXNW',
    'Super Admin',
    'SUPER_ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO "KategoriUMKM" ("id", "nama", "createdAt", "updatedAt")
VALUES 
    ('clkat001', 'Makanan & Minuman', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('clkat002', 'Kerajinan Tangan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('clkat003', 'Fashion & Tekstil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('clkat004', 'Pertanian & Perkebunan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('clkat005', 'Jasa & Layanan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

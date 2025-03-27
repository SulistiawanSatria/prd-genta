# Backend API

Backend API untuk aplikasi Genta, platform review produk fashion.

## Teknologi yang Digunakan

- Node.js
- Express.js
- MongoDB
- ImageKit (untuk penyimpanan gambar)
- Multer (untuk handling file upload)

## Prasyarat

- Node.js (v14 atau lebih tinggi)
- MongoDB
- Akun ImageKit

## Instalasi

1. Clone repository
```bash
git clone https://github.com/yourusername/BackEnd-RNext-Team1-milestone1.git
cd BackEnd-RNext-Team1-milestone1
```

2. Install dependencies
```bash
npm install
```

3. Buat file `.env` di root directory dan isi dengan konfigurasi berikut:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/genta
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

4. Jalankan aplikasi
```bash
npm start
```

## Struktur Project

```
BackEnd-RNext-Team1-milestone1/
├── controllers/
│   ├── product_controller.js
│   └── review_controller.js
├── models/
│   ├── product_models.js
│   └── review_models.js
├── routers/
│   ├── product_router.js
│   └── review_router.js
├── middleware/
│   └── upload.js
├── utils/
│   └── imagekit.js
├── app.js
└── package.json
```

## API Endpoints

### Products

#### GET /api/products
Mendapatkan daftar semua produk dengan pagination.

**Query Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah item per halaman (default: 10)

**Response:**
```json
{
    "success": true,
    "message": "Products found",
    "data": [
        {
            "_id": "string",
            "name": "string",
            "price": number,
            "description": "string",
            "image": "string",
            "rating": number,
            "reviews": []
        }
    ],
    "pagination": {
        "currentPage": number,
        "totalPages": number,
        "totalProducts": number,
        "limit": number
    }
}
```

#### GET /api/products/:id
Mendapatkan detail produk berdasarkan ID.

**Response:**
```json
{
    "success": true,
    "message": "Product found",
    "data": {
        "_id": "string",
        "name": "string",
        "price": number,
        "description": "string",
        "image": "string",
        "rating": number,
        "reviews": []
    }
}
```

#### POST /api/products
Membuat produk baru.

**Request Body (multipart/form-data):**
- `name`: string (3-100 karakter)
- `price`: number (positif)
- `description`: string (10-500 karakter)
- `image`: file (JPG/JPEG/PNG, max 5MB)

**Response:**
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "_id": "string",
        "name": "string",
        "price": number,
        "description": "string",
        "image": "string",
        "rating": 0,
        "reviews": []
    }
}
```

#### PUT /api/products/:id
Memperbarui produk berdasarkan ID.

**Request Body (multipart/form-data):**
- `name`: string (3-100 karakter) (optional)
- `price`: number (positif) (optional)
- `description`: string (10-500 karakter) (optional)
- `image`: file (JPG/JPEG/PNG, max 5MB) (optional)

**Response:**
```json
{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "_id": "string",
        "name": "string",
        "price": number,
        "description": "string",
        "image": "string",
        "rating": number,
        "reviews": []
    }
}
```

#### DELETE /api/products/:id
Menghapus produk berdasarkan ID.

**Response:**
```json
{
    "success": true,
    "message": "Product and associated reviews deleted successfully"
}
```

### Reviews

#### GET /api/reviews/product/:id
Mendapatkan daftar review untuk produk tertentu dengan pagination.

**Query Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah item per halaman (default: 5)

**Response:**
```json
{
    "success": true,
    "message": "Reviews found",
    "data": [
        {
            "_id": "string",
            "product_id": "string",
            "user_id": "string",
            "rating": number,
            "review_text": "string",
            "image_user": "string",
            "size_user": {
                "bust": number,
                "waist": number,
                "hips": number,
                "height": number,
                "weight": number
            },
            "ThumbUp_rate": number
        }
    ],
    "pagination": {
        "currentPage": number,
        "totalPages": number,
        "totalReviews": number,
        "limit": number
    }
}
```

#### POST /api/reviews
Membuat review baru.

**Request Body:**
```json
{
    "product_id": "string",
    "user_id": "string",
    "rating": number,
    "review_text": "string",
    "image_user": "string",
    "size_user": {
        "bust": number,
        "waist": number,
        "hips": number,
        "height": number,
        "weight": number
    }
}
```

**Response:**
```json
{
    "success": true,
    "message": "Review created successfully",
    "data": {
        "_id": "string",
        "product_id": "string",
        "user_id": "string",
        "rating": number,
        "review_text": "string",
        "image_user": "string",
        "size_user": {
            "bust": number,
            "waist": number,
            "hips": number,
            "height": number,
            "weight": number
        },
        "ThumbUp_rate": 0
    }
}
```

#### PATCH /api/reviews/:id
Memperbarui review berdasarkan ID.

**Request Body:**
```json
{
    "rating": number (optional),
    "review_text": "string" (optional),
    "image_user": "string" (optional),
    "size_user": {
        "bust": number (optional),
        "waist": number (optional),
        "hips": number (optional),
        "height": number (optional),
        "weight": number (optional)
    }
}
```

**Response:**
```json
{
    "success": true,
    "message": "Review updated successfully",
    "data": {
        "_id": "string",
        "product_id": "string",
        "user_id": "string",
        "rating": number,
        "review_text": "string",
        "image_user": "string",
        "size_user": {
            "bust": number,
            "waist": number,
            "hips": number,
            "height": number,
            "weight": number
        },
        "ThumbUp_rate": number
    }
}
```

#### DELETE /api/reviews/:id
Menghapus review berdasarkan ID.

**Response:**
```json
{
    "success": true,
    "message": "Review deleted successfully"
}
```

## Validasi Input

### Product
- Nama: 3-100 karakter
- Harga: harus positif
- Deskripsi: 10-500 karakter
- Gambar: JPG/JPEG/PNG, max 5MB

### Review
- Rating: 1-5
- Teks review: 10-500 karakter
- Gambar user: URL valid
- Size user: semua field harus diisi

## Error Handling

Semua endpoint mengembalikan format error yang konsisten:

```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error message"
}
```

Status code yang digunakan:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Testing

Untuk menjalankan test:
```bash
npm test
```

## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## Lisensi

[MIT License](LICENSE) 
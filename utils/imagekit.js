const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = async (file, folder = 'products') => {
    try {
        // Validasi file
        if (!file) {
            throw new Error('No file provided');
        }

        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed');
        }

        // Validasi ukuran file (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB');
        }

        // Upload ke ImageKit
        const result = await imagekit.upload({
            file: file.buffer,
            fileName: `${Date.now()}-${file.originalname}`,
            folder: folder,
            useUniqueFileName: true
        });

        return {
            url: result.url,
            fileId: result.fileId
        };
    } catch (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};

const deleteImage = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
        return true;
    } catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
    }
};

module.exports = {
    uploadImage,
    deleteImage
}; 
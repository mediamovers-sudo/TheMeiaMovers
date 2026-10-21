const path = require('path');
const { Readable } = require('stream');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = require('../config/env');

// Configure Cloudinary from environment variables (never log credentials)
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });
}

// 1. Multer memory storage (no local disk files)
const storage = multer.memoryStorage();

// 2. File type filter (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpe?g|png|webp|gif)$/i;
  const allowedMimeTypes = /^image\/(jpeg|png|webp|gif)$/i;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();

  if (allowedExtensions.test(extname) && allowedMimeTypes.test(mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type. Only JPG, PNG, WebP, and GIF images are permitted.'));
};

// 3. Multer upload instance with 10MB size limit
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB maximum file size
  fileFilter
});

// 4. Controller to stream image buffer to Cloudinary
const handleUpload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided for upload.' });
  }

  // Ensure Cloudinary is configured
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('[Upload] Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    return res.status(500).json({
      error: 'Cloudinary storage is not configured on the server. Please verify environment variables.'
    });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'mediamovers',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    // Return the secure URL for database storage
    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url
    });
  } catch (err) {
    console.error('[Upload] Cloudinary upload stream failed:', err.message || err);
    return res.status(500).json({
      error: 'Failed to upload image to Cloudinary: ' + (err.message || 'Unknown error')
    });
  }
};

module.exports = {
  uploadMiddleware: upload.single('image'),
  handleUpload
};

const path = require('path');
const multer = require('multer');

// Configure disk storage for uploaded media
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'upload-' + uniqueSuffix + ext);
  }
});

// Allow only safe image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const mimeTypeMatch = allowedTypes.test(file.mimetype);
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeTypeMatch && extMatch) {
    return cb(null, true);
  }
  cb(new Error('Only valid image files (JPEG, PNG, WebP, GIF, SVG) are permitted.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

const handleUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  // Return server-relative URL path — never exposing internal storage secrets
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
};

module.exports = {
  uploadMiddleware: upload.single('image'),
  handleUpload
};

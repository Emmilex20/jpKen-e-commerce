// apps/server/src/controllers/uploadController.js
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Store uploads in a folder named 'uploads' at server root
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter function
function checkFileType(file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadImageToCloudinary = asyncHandler(async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(err.message);
    }

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ecommerce', // Optional: specify a folder in Cloudinary
        });

        // Delete local file after successful upload to Cloudinary (optional but recommended)
        // fs.unlink(req.file.path, (unlinkErr) => {
        //   if (unlinkErr) console.error("Error deleting local file:", unlinkErr);
        // });

        res.status(200).send({
          message: 'Image uploaded successfully!',
          imageUrl: result.secure_url,
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        res.status(500);
        throw new Error('Image upload failed to Cloudinary');
      }
    } else {
      res.status(400);
      throw new Error('No image file provided');
    }
  });
});

export { uploadImageToCloudinary };
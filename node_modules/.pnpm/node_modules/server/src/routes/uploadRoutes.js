// apps/backend/routes/uploadRoutes.js
import path from 'path'; // Node.js built-in module for path manipulation
import express from 'express';
import multer from 'multer'; // Import multer

const router = express.Router();

// Configure storage for Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Set the destination folder for uploaded files
    // 'uploads/' refers to the folder we created in Step 2
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Define the filename for the uploaded file
    // Uses the current date (for uniqueness) and the original file extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Function to check file type (e.g., only allow images)
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/; // Allowed file types (regex)
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/; // Allowed MIME types (regex)

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file and provide an error message
    cb(new Error('Images only!'), false);
  }
}

// Initialize Multer upload middleware
const upload = multer({ storage, fileFilter });

// Define the POST route for file uploads
// 'image' should match the field name in your FormData on the frontend
router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    // If a file was uploaded, send back its path
    // Multer stores the relative path. We prepend '/' to make it accessible from the root URL.
    res.send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    });
  } else {
    // If no file was uploaded
    res.status(400).send({ message: 'No image file provided' });
  }
});

export default router;
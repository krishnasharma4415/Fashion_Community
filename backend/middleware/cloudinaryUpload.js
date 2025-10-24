const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary manually)
const storage = multer.memoryStorage();

console.log('☁️ Cloudinary upload middleware configured');

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder, transformation = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `fashion-community/${folder}`,
      resource_type: 'auto',
      ...transformation
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Middleware to handle post uploads
const uploadPost = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File filter - Processing file:', file.originalname, 'Type:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File accepted');
      cb(null, true);
    } else {
      console.log('❌ File rejected - not an image');
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware to handle profile picture uploads
const uploadProfile = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware to process uploaded files and upload to Cloudinary
const processPostUpload = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, 'posts', {
        transformation: [
          { width: 1080, height: 1080, crop: 'limit', quality: 'auto' }
        ]
      })
    );

    const results = await Promise.all(uploadPromises);
    
    // Add Cloudinary results to req.files
    req.files = req.files.map((file, index) => ({
      ...file,
      path: results[index].secure_url,
      filename: results[index].public_id
    }));

    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

// Middleware to process profile picture upload
const processProfileUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, 'profiles', {
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }
      ]
    });

    // Add Cloudinary results to req.file
    req.file.path = result.secure_url;
    req.file.filename = result.public_id;

    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Profile picture upload failed' });
  }
};

module.exports = {
  uploadPost,
  uploadProfile,
  processPostUpload,
  processProfileUpload,
  cloudinary
};
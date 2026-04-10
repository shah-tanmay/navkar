const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Credentials from backend .env
cloudinary.config({
  cloud_name: 'dhxa5zutl',
  api_key: '534623915147932',
  api_secret: 'kDl2Qmmv9TQLmZ2Rz6xpgOcRY8Q'
});

const imagesToUpload = [
  // Hero Carousel
  'carousel-4.jpg',
  'carousel-6.jpg',
  'sofa-2.png',
  
  // Gallery
  'gallery-1.jpg',
  'gallery-2.jpg',
  'gallery-3.jpg',
  'gallery-5.jpg',
  
  // Sections
  'shop.jpg',      // About
  'blinds.jpg',    // Discount
  'carousel-5.jpg', // Reviews background
  'josh.png',      // Reviewer profile
  
  // Icons
  'high-quality.png',
  'warranty.png',
  'shipping.png',
  'customer-support.png',
  
  // Logo
  'logo.png'
];

async function uploadImages() {
  console.log('--- Starting System-wide Cloudinary Upload ---');
  const results = {};

  for (const imageName of imagesToUpload) {
    const filePath = path.join(__dirname, '..', 'public', 'images', imageName);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    try {
      console.log(`Uploading ${imageName}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'navkar_assets',
        use_filename: true,
        unique_filename: false,
      });
      results[imageName] = result.secure_url;
      console.log(`Successfully uploaded ${imageName}: ${result.secure_url}`);
    } catch (error) {
      console.error(`Error uploading ${imageName}:`, error.message);
    }
  }

  console.log('\n--- UPLOAD COMPLETE ---');
  console.log('JSON Mapping:\n');
  console.log(JSON.stringify(results, null, 2));
}

uploadImages();

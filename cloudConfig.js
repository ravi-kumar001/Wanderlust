const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Establish cloudnary database relationship
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust-Dev',
        allowedformats: ["png", "jpg", "jpeg"], // supports promises as well
    },
});

module.exports = { cloudinary, storage };
// uploadMiddleware.js
import multer from 'multer'

const storage = multer.memoryStorage() // Store files in memory temporarily

// Define fields in upload configuration to expect img1, img2, img3, and img4
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // optional: limit file size to 5MB, adjust as needed
})

export default upload

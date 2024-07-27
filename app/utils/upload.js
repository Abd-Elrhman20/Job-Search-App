import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './error.js';

import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({   // upload from multer to cloudinary using multer-storage-cloudinary
    cloudinary: cloudinary,
    params: {
        folder: 'uploads-PDF', // Folder name in Cloudinary
        format: async (req, file) => 'pdf', // supports promises as well
        public_id: (req, file) => {
            // Generate a UUID for the file name
            // add file.originalname without .pdf
            return uuidv4() + "-" + file.originalname.replace('.pdf', '')
        },
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('application/pdf')) {
        // To accept the file pass `true`, like so:
        cb(null, true)
    }
    else {
        // To reject this file pass `false`, like so:
        cb(null, false)
        // You can always pass an error if something goes wrong:
        cb(new AppError('PDF Only'))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

export default upload
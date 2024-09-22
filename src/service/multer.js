import multer from 'multer';
import { AppError } from '../../utils/classError.js';

export const validExtension = {
    pdf: ['pdf/pdf']
};

export const multerHost = (customValidation = ['pdf/pdf']) => {
    const storage = multer.diskStorage({});

    const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError('File type not supported', 400), false);
        }
    };

    const upload = multer({
        storage,
        fileFilter// Limit file size to 10MB
    });

    return upload;
};

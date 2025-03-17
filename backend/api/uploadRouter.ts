import express, { Request, Response, NextFunction, Router } from 'express';
import multer from 'multer';
import { uploadToS3 } from '../services/s3Service';

const router: Router = express.Router();

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

router.post('/', upload.single('image'), (req: Request, res: Response, next: NextFunction) => {
    const handler = async () => {
        try {
            console.log('\n=== Upload Request Started ===');
            console.log('Content-Type:', req.headers['content-type']);
            console.log('Request has file?:', !!req.file);
            
            if (!req.file) {
                console.error('No file in request body');
                console.log('Request body:', req.body);
                return res.status(400).json({ error: 'No file uploaded' });
            }

            console.log('File details:', {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
            });

            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            console.log('Generated filename:', filename);
            
            try {
                console.log('Attempting S3 upload...');
                const fileUrl = await uploadToS3(req.file.buffer, filename);
                console.log('S3 upload successful:', fileUrl);
                return res.json({ url: fileUrl });
            } catch (s3Error) {
                console.error('S3 upload failed:', s3Error);
                throw s3Error;
            }
        } catch (error) {
            console.error('Upload handler error:', error);
            next(error);
        }
    };

    handler().catch(error => {
        console.error('Handler catch error:', error);
        next(error);
    });
});

export default router;
import express, { Request, Response, Router, NextFunction } from 'express';
import { processTryOn } from '../services/tryonService';

// Interface for expected request body
interface TryOnRequestBody {
    personImage: string;
    garmentImage: string;
}

// Create Express Router instance
const router: Router = express.Router();

// Define POST /process route
router.post(
    '/process',
    (req: Request<Record<string, never>, any, TryOnRequestBody>, res: Response, next: NextFunction) => {
        const handler = async () => {
            console.log('\n=== Try-on Request Started ===');
            console.log('Request body:', {
                hasPersonImage: !!req.body.personImage,
                hasGarmentImage: !!req.body.garmentImage,
                personImageUrl: req.body.personImage?.substring(0, 100),
                garmentImageUrl: req.body.garmentImage?.substring(0, 100),
            });

            // Validation: Check if both images are provided
            if (!req.body.personImage || !req.body.garmentImage) {
                console.error('Missing required images');
                return res.status(400).json({
                    error: 'Both person and garment images are required',
                });
            }

            try {
                // Process try-on logic (async/await style)
                const result = await processTryOn(req.body);
                console.log('Try-on processing completed:', result);
                return res.json(result);
            } catch (error) {
                console.error('Try-on processing failed:', error);
                return next(error); // Forward to error handler
            }
        };

        handler().catch(next);
    }
);

export default router;

import { fal } from "@fal-ai/client";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const FAL_KEY = process.env.FAL_KEY;

console.log('=== Fal.ai Configuration ===');
console.log('FAL_KEY status:', {
    exists: !!FAL_KEY,
    length: FAL_KEY?.length
});

if (!FAL_KEY) {
    throw new Error('FAL_KEY is required in environment variables');
}

// Configure fal client
fal.config({
    credentials: FAL_KEY
});

console.log('Fal.ai client configured successfully');

export { fal }; 
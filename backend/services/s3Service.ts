import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('\n=== S3 Configuration ===');
console.log('AWS Config:', {
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    forcePathStyle: false // Changed to false for virtual-hosted style URLs
});

export async function uploadToS3(file: Buffer, filename: string): Promise<string> {
    try {
        console.log('\n=== S3 Upload Started ===');
        
        // Verify AWS credentials
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            throw new Error('AWS credentials are missing');
        }

        if (!process.env.AWS_BUCKET_NAME) {
            throw new Error('AWS_BUCKET_NAME is missing');
        }

        console.log('AWS Configuration:', {
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_BUCKET_NAME,
            hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
        });

        console.log('File details:', {
            size: file.length,
            filename: filename
        });

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${filename}`,
            Body: file,
            ContentType: 'image/jpeg'
        });

        console.log('Sending S3 command...');
        const result = await s3Client.send(command);
        console.log('S3 response:', {
            requestId: result.$metadata.requestId,
            httpStatusCode: result.$metadata.httpStatusCode
        });

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/uploads/${filename}`;
        return fileUrl;
    } catch (error: any) {
        console.error('\n=== S3 Upload Error ===');
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            requestId: error.$metadata?.requestId,
            stack: error.stack
        });
        throw error;
    }
} 
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('\n=== R2 Configuration ===');
console.log('R2 Config:', {
    accountId: !!process.env.R2_ACCOUNT_ID,
    hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME
});

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
});

export async function uploadToR2(file: Buffer, filename: string): Promise<string> {
    try {
        console.log('\n=== Starting R2 Upload ===');
        console.log('Upload params:', {
            bucket: process.env.R2_BUCKET_NAME,
            key: `uploads/${filename}`,
            fileSize: file.length
        });

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `uploads/${filename}`,
            Body: file,
            ContentType: 'image/jpeg'
        });

        console.log('Sending R2 command...');
        await r2Client.send(command);

        // Construct the public URL using your Cloudflare custom domain
        const fileUrl = `https://${process.env.R2_BUCKET_NAME}.your-subdomain.workers.dev/uploads/${filename}`;
        console.log('Generated URL:', fileUrl);
        
        return fileUrl;
    } catch (error: any) {
        console.error('\n=== R2 Upload Error ===');
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            requestId: error.$metadata?.requestId
        });
        throw new Error(`R2 upload failed: ${error.message}`);
    }
} 
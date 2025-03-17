import dotenv from 'dotenv';
import path from 'path';

// Load .env file first
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import config to ensure fal.ai is configured
import './config';

import express from 'express';
import cors from 'cors';
import tryonRouter from './api/tryonRouter';
import uploadRouter from './api/uploadRouter';

// Log environment variables (without sensitive values)
console.log('Environment loaded:', {
    hasAWSRegion: !!process.env.AWS_REGION,
    hasAWSBucket: !!process.env.AWS_BUCKET_NAME,
    hasAWSKeys: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
    port: process.env.PORT
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
const uploadDir = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadDir)) {
    require('fs').mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/tryon', tryonRouter);
app.use('/api/upload', uploadRouter);

// Add a test route at the top level
app.get('/test', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Add this function at the top
function getAllIPv4Addresses() {
    const interfaces = require('os').networkInterfaces();
    const ipAddresses = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                ipAddresses.push(iface.address);
            }
        }
    }
    return ipAddresses;
}

// Add this new endpoint
app.get('/ip', (req, res) => {
    const ips = getAllIPv4Addresses();
    res.json({ 
        ips,
        port: PORT
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: err.message || 'Something broke!',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// At the top of the file, add this function
function getLocalIPAddress() {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n=== Server Started ===');
    console.log(`Server is listening on all interfaces (0.0.0.0:${PORT})`);
    console.log('\nTest the connection:');
    console.log(`curl http://localhost:${PORT}/test`);
    console.log(`curl http://192.168.0.105:${PORT}/test`);
});
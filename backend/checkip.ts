import { networkInterfaces } from 'os';

const getLocalIP = () => {
    const nets = networkInterfaces();
    let localIP = '';

    for (const name of Object.keys(nets)) {
        for (const net of nets[name] || []) {
            // Skip internal and non-IPv4 addresses
            if (!net.internal && net.family === 'IPv4') {
                console.log(`Found IP address: ${net.address} on interface: ${name}`);
                localIP = net.address;
            }
        }
    }

    if (!localIP) {
        console.log('No suitable IP address found');
        return null;
    }

    return localIP;
};

const ip = getLocalIP();
console.log('\nYour local IP address is:', ip);
console.log('Use this IP in your React Native app\n'); 
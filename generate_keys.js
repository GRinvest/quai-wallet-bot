import crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex'); // 32 байта = 256 бит
const IV = crypto.randomBytes(16).toString('hex'); // 16 байт = 128 бит

console.log(`ENCRYPTION_KEY=${ENCRYPTION_KEY}`);
console.log(`IV=${IV}`);

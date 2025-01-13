import crypto from "crypto";
// Generate a random 256-bit (32-byte) secretKey
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('Your JWT Secret:', secretKey);

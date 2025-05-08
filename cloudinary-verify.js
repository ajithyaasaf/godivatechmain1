// Verify Cloudinary configuration for production
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('=== Cloudinary Production Configuration Test ===');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key (first 4 chars):', process.env.CLOUDINARY_API_KEY?.substring(0, 4) + '...');
console.log('API Secret (first 4 chars):', process.env.CLOUDINARY_API_SECRET?.substring(0, 4) + '...');

// Configure Cloudinary with production credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test connection to Cloudinary
async function testCloudinaryConnection() {
  try {
    console.log('\nTesting Cloudinary connection...');
    // Simple API call to verify credentials
    const result = await cloudinary.api.usage();
    console.log('✅ Cloudinary connection successful!');
    console.log('Usage info:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Status code:', error.http_code);
    return false;
  }
}

// Run the test
testCloudinaryConnection();
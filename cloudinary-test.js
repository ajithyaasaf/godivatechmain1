// Simple test file to verify Cloudinary credentials
import { v2 as cloudinary } from 'cloudinary';

// Log the actual values (without revealing full secrets in logs)
console.log('Cloudinary Config Check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY (first 4 chars):', process.env.CLOUDINARY_API_KEY?.substring(0, 4) + '...');
console.log('CLOUDINARY_API_SECRET (first 4 chars):', process.env.CLOUDINARY_API_SECRET?.substring(0, 4) + '...');
console.log('API_KEY length:', process.env.CLOUDINARY_API_KEY?.length);
console.log('API_SECRET length:', process.env.CLOUDINARY_API_SECRET?.length);

// Configure Cloudinary with the current environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Try a simple API call that doesn't upload anything but tests authentication
async function testCloudinaryConnection() {
  try {
    console.log('Testing Cloudinary connection...');
    // Simple API call to get account usage
    const result = await cloudinary.api.usage();
    console.log('Cloudinary connection successful!');
    console.log('Usage info:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('Cloudinary connection test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Status code:', error.http_code);
    return false;
  }
}

// Run the test
testCloudinaryConnection();
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'doeodacsg',
  api_key: '269267633995791',
  api_secret: 'wUw9Seu6drQEIbQ1tAvYeVyqHdU',
  secure: true,
});

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "godivatech",
  private_key_id: "c68dd69c71e0c3bbc5c3d8c0ee8e74dd14698b84",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2bIlD5yJmvHaE\nlvFd2m9iahBmR1YVFHwRGh+xzTOg2rQoZjA3FiARnQQ3yVWEkvQzFOd0IvRLQm5k\nfg5SKHkj9L5uH2TEzXq6pqx4MgLqSbGO1DjhJUKVaRxf5KXzGI7kEBe7c/Lhx7wq\nFVJy+PKQDemQBGGDUBKwFGV5f0kQXNLYI0pqVjO9GBx6bZo3TmJCyDN8pVWQ6Jzm\n7sIWdF0ItaXkJnp7zJrM9lQGfYeQGGxGCH8OaLBLLZCE7uQzMdVpGXBMOCnPLWmC\nz0m+OpnLztVpFpMvDAQABp/Q5pqJw8mASTVGHnF5FBTpKN+P0fOd5MYKvdJSrZJU\nFN8iN5wDAgMBAAECggEAJgJNu8DKLfD4evqJtN1+4PQZ8E4A8aWOQkQz2HDTuVc7\nPD8rZT6fH8pJkXKWAy+W2OJlIK9T6AQr7hL3D7wPCfQNTVGCJsGAEP7F3bKTh8tW\nPpgcb0YHpwHqKtTjB/+wNYLv0qVJqAKQX9BoUFgJKw0L0fhHJP8z8VhDFOQXp4s9\nRWsFSz8MWO8hWh8CJcmF2U4KqXKpqMOQ5oqH/VJNhDEhz0YiJBwGJN8P8EtqXVYt\nGH0LsAYF8dVGF7tDGBYQQT8kFQVE/H9s0qY3QLgJ5YmDzg9r0/8VJwYjlNpQPH3V\nYH6oQs0q8jKtLLKN7F5LW9lJQBQFrm9LF7Qt0QKBgQDpJaFWvZ9X8H3mPFPO2Tce\nvYBBJHJGLXQ0YxQFkGOWwQUJbUQvNLHHJdGWE5PQVMpF7LF5QK9Q3bKpXQOQdB7o\nt7T8YJMmYqAGVLG2pW8fh5PNdGqHZQWJfNGsQwFQfCq9Kf4rXJLFWHFQ8F3O3F9Y\nQTJzQF8L7QLQQQKBgQDIWqtBq3TqP8F5fPF5F7F5F7FqF5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\nF5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7F5F7\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-k0ndo@godivatech.iam.gserviceaccount.com",
  client_id: "117635929699668954095",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k0ndo%40godivatech.iam.gserviceaccount.com"
};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Function to convert local file to base64
function fileToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  const base64 = file.toString('base64');
  const ext = path.extname(filePath).slice(1);
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

// Function to upload image to Cloudinary
async function uploadToCloudinary(localPath, projectTitle) {
  try {
    const fullPath = path.resolve(process.cwd(), localPath.replace(/^\//, ''));
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return null;
    }

    const base64Image = fileToBase64(fullPath);
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'godivatech/logos',
      resource_type: 'auto',
    });

    console.log(`✅ Uploaded ${projectTitle}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${projectTitle}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('Starting logo image upload to Cloudinary...\n');

  // Get all projects from Firestore
  const projectsRef = db.collection('projects');
  const snapshot = await projectsRef.get();

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const doc of snapshot.docs) {
    const project = doc.data();
    const projectId = doc.id;

    // Check if image starts with /attached_assets/ (local file)
    if (project.image && project.image.startsWith('/attached_assets/')) {
      console.log(`\nProcessing: ${project.title}`);
      console.log(`Current image: ${project.image}`);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(project.image, project.title);

      if (cloudinaryUrl) {
        // Update Firestore with new Cloudinary URL
        await projectsRef.doc(projectId).update({
          image: cloudinaryUrl,
          updatedAt: new Date()
        });
        console.log(`Updated Firestore record for: ${project.title}`);
        uploadedCount++;
      } else {
        errorCount++;
      }
    } else if (project.image && project.image.includes('cloudinary.com')) {
      console.log(`⏭️  Skipping ${project.title} - already on Cloudinary`);
      skippedCount++;
    } else {
      console.log(`⚠️  Skipping ${project.title} - unknown image format: ${project.image}`);
      skippedCount++;
    }
  }

  console.log('\n=================================');
  console.log('Upload Summary:');
  console.log(`✅ Uploaded: ${uploadedCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('=================================\n');
}

main()
  .then(() => {
    console.log('Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

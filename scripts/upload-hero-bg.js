import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function uploadHeroBg() {
  const heroBgPath = path.resolve(process.cwd(), "client/src/assets/herosection/hero-full-bg.png");
  
  // Delete the accidental double-nested one
  try {
    await cloudinary.uploader.destroy("godivatech/herosection/godivatech/herosection/hero-full-bg");
  } catch (e) {}

  console.log("Uploading hero background to Cloudinary under godivatech/herosection/hero-full-bg...");
  const result = await cloudinary.uploader.upload(heroBgPath, {
    public_id: "hero-full-bg",
    folder: "godivatech/herosection",
    asset_folder: "godivatech/herosection",
    overwrite: true,
    resource_type: "image"
  });

  // Ensure asset_folder is explicitly set in Cloudinary Media Library UI
  await cloudinary.api.update(result.public_id, {
    asset_folder: "godivatech/herosection"
  });

  console.log("Upload Success!");
  console.log("Public ID:", result.public_id);
  console.log("Secure URL:", result.secure_url);
}

uploadHeroBg().catch(console.error);

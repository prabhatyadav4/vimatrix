import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Normalize backslashes for Windows compatibility
    const normalizedPath = localFilePath.replace(/\\/g, "/");

    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "auto",
    });

    console.log("File uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    // Log the actual error so you can see what's going wrong
    console.error("Cloudinary upload failed:", error.message);

    // Only unlink if file actually exists (prevents secondary crash)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
// lib/cloudinaryUpload.ts
import imageCompression from "browser-image-compression";

export async function uploadImageToCloudinary(file: File): Promise<string> {
  // 1) compress (optional)
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  // 2) prepare form-data
  const fd = new FormData();
  fd.append("file", compressed);
  fd.append("upload_preset", process.env.CLOUDINARY_PRESET!);

  // 3) POST to Cloudinary unsigned endpoint
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      process.env.CLOUDINARY_CLOUD
    }/upload`,
    { method: "POST", body: fd }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");
  const json = await res.json();
  return json.secure_url as string; // full https URL
}

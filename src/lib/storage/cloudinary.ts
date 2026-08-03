import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { StorageProvider, UploadResult, StorageResourceType } from "./types";

// Cloudinary-backed storage. Never store uploads in the local filesystem or
// Git — this is the ONLY place provider credentials are read, and they never
// leave the server (no secret is ever passed to a client component).

let configured = false;

function ensureConfigured() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET — see .env.example."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

export const cloudinaryStorage: StorageProvider = {
  async upload(buffer, { folder, filename, resourceType }): Promise<UploadResult> {
    ensureConfigured();

    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          filename_override: filename,
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload returned no result."));
            return;
          }
          resolve(uploadResult as unknown as Record<string, unknown>);
        }
      );
      stream.end(buffer);
    });

    return {
      publicId: result.public_id as string,
      url: result.secure_url as string,
      width: result.width as number | undefined,
      height: result.height as number | undefined,
      bytes: result.bytes as number,
      format: result.format as string,
      resourceType: (result.resource_type as StorageResourceType) ?? resourceType,
    };
  },

  async destroy(publicId, resourceType) {
    ensureConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  },
};

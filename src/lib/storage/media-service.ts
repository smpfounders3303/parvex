import "server-only";
import { prisma } from "@/lib/db/prisma";
import { cloudinaryStorage } from "./cloudinary";
import type { StorageResourceType } from "./types";
import type { MediaCategory, MediaType } from "@prisma/client";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
];

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — matches Contact attachment limit

export function classifyMime(mimeType: string): {
  mediaType: MediaType;
  resourceType: StorageResourceType;
} {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return { mediaType: "IMAGE", resourceType: "image" };
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return { mediaType: "VIDEO", resourceType: "video" };
  if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) return { mediaType: "DOCUMENT", resourceType: "raw" };
  throw new Error(`Unsupported file type: ${mimeType}`);
}

export function assertValidFile(file: { size: number; type: string; name: string }) {
  if (file.size <= 0) throw new Error("The uploaded file is empty.");
  if (file.size > MAX_BYTES) throw new Error("Files must be 10 MB or smaller.");
  // Do not trust extension alone — classifyMime validates the real MIME type.
  classifyMime(file.type);
  if (!file.name || file.name.length > 200) throw new Error("Invalid filename.");
}

/** Uploads a validated file to Cloudinary and persists its Media record. */
export async function createMediaFromFile(
  file: File,
  opts: { category: MediaCategory; folder: string; altText?: string; title?: string }
) {
  assertValidFile(file);
  const { mediaType, resourceType } = classifyMime(file.type);

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await cloudinaryStorage.upload(buffer, {
    folder: opts.folder,
    filename: file.name,
    resourceType,
  });

  return prisma.media.create({
    data: {
      type: mediaType,
      category: opts.category,
      publicId: uploaded.publicId,
      url: uploaded.url,
      filename: file.name,
      mimeType: file.type,
      width: uploaded.width,
      height: uploaded.height,
      bytes: uploaded.bytes,
      altText: opts.altText,
      title: opts.title,
    },
  });
}

/** Returns true if a Media record is referenced anywhere and therefore unsafe to delete. */
export async function isMediaReferenced(mediaId: string): Promise<boolean> {
  const [cover, thumb, gallery, service, attachment] = await Promise.all([
    prisma.project.count({ where: { coverImageId: mediaId } }),
    prisma.project.count({ where: { thumbnailId: mediaId } }),
    prisma.projectGalleryImage.count({ where: { mediaId } }),
    prisma.service.count({ where: { mediaId } }),
    prisma.contactAttachment.count({ where: { mediaId } }),
  ]);
  return cover + thumb + gallery + service + attachment > 0;
}

/** Safely deletes a Media record: refuses if referenced, otherwise removes from Cloudinary + DB. */
export async function deleteMediaSafely(mediaId: string) {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) return;

  if (await isMediaReferenced(mediaId)) {
    throw new Error(
      "This media file is still used by a project, service, or contact message and cannot be deleted."
    );
  }

  const resourceType: StorageResourceType =
    media.type === "IMAGE" ? "image" : media.type === "VIDEO" ? "video" : "raw";

  await cloudinaryStorage.destroy(media.publicId, resourceType);
  await prisma.media.delete({ where: { id: mediaId } });
}

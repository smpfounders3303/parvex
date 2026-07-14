export type StorageResourceType = "image" | "video" | "raw";

export interface UploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  bytes: number;
  format: string;
  resourceType: StorageResourceType;
}

export interface StorageProvider {
  /** Upload a buffer. `folder` namespaces assets by category (e.g. "parvex/projects"). */
  upload(
    buffer: Buffer,
    options: { folder: string; filename: string; resourceType: StorageResourceType }
  ): Promise<UploadResult>;

  /** Permanently remove an asset by its provider public ID. */
  destroy(publicId: string, resourceType: StorageResourceType): Promise<void>;
}

const { PrismaClient } = require('@prisma/client');
const { v2: cloudinary } = require('cloudinary');

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  const mediaItems = await prisma.media.findMany({
    select: { id: true, publicId: true, type: true, filename: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log('MEDIA_ITEMS_TO_DELETE', mediaItems.length);

  if (mediaItems.length === 0) {
    console.log('No media rows found. Nothing to delete.');
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.projectGalleryImage.deleteMany({});
    await tx.project.updateMany({ data: { coverImageId: null, thumbnailId: null } });
    await tx.service.updateMany({ data: { mediaId: null } });
    await tx.contactAttachment.deleteMany({});
  });

  for (const media of mediaItems) {
    const resourceType = media.type === 'IMAGE' ? 'image' : media.type === 'VIDEO' ? 'video' : 'raw';

    if (media.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId, { resource_type: resourceType });
        console.log('DESTROYED', media.filename, media.publicId);
      } catch (error) {
        console.log('DESTROY_ERROR', media.filename, media.publicId, error && error.message ? error.message : error);
      }
    }

    await prisma.media.delete({ where: { id: media.id } });
    console.log('DELETED_DB', media.filename, media.id);
  }

  const remaining = await prisma.media.count();
  console.log('REMAINING_MEDIA', remaining);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

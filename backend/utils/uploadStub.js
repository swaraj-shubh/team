// For now, we just return a fake URL or file path.
export const uploadIdCard = async (file) => {
  // TODO: integrate Cloudinary, S3, etc.
  // file will be from multer (file.path)
  return `/uploads/${file.filename}`; // fake or local path
};

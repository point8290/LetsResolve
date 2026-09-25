import { randomUUID } from "crypto";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import { s3Client } from "../config/awsConfig";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 5;

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(new Error(`Unsupported file type: ${file.mimetype}`));
    return;
  }
  callback(null, true);
};

const storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_S3_BUCKET_NAME || "",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  // The original filename is attacker-controlled input: using it verbatim as
  // the S3 key risks path traversal and lets one upload silently overwrite
  // another. A random key with just the (sanitized) extension carried over
  // avoids both.
  key: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .slice(0, 10)
      .replace(/[^a-zA-Z0-9.]/g, "");
    cb(null, `${randomUUID()}${extension}`);
  },
});

export const uploadMultiple = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES_PER_UPLOAD },
  fileFilter,
});

export const uploadSingle = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

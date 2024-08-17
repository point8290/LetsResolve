import multer from "multer";
import { s3Client } from "../config/awsConfig";
import multerS3 from "multer-s3";
import * as path from "path";
import { config } from "dotenv";
config({ path: ".env.local" });

const storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_S3_BUCKET_NAME || "",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, path.basename(`${file.originalname}_${Date.now()}`));
  },
});

export const upload = multer({
  storage,
}).array("attachments");

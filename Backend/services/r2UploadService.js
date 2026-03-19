const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY
  }
});

const uploadToR2 = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const key = Date.now() + "-" + file.originalname;

  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype
  };

  await s3.send(new PutObjectCommand(params));

  // ✅ Public file URL
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;
};

module.exports = uploadToR2;
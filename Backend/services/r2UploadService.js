const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY
  },
  forcePathStyle: true // ✅ ADD THIS
});

const uploadToR2 = async (file) => {
  try {
    console.log("📂 File received:", file);

    const fileStream = fs.createReadStream(file.path);
    const key = Date.now() + "-" + file.originalname;

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype
    };

    console.log("🚀 Uploading to R2 with params:", params);

    const result = await s3.send(new PutObjectCommand(params));

    console.log("✅ R2 Upload Success:", result);

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    console.log("🌐 File URL:", fileUrl);

    return fileUrl;

  } catch (error) {
    console.error("❌ R2 Upload Failed:", error);
    throw error;
  }
};

module.exports = uploadToR2;
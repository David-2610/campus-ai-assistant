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
  try {
    const fileStream = fs.createReadStream(file.path);

    // ✅ Clean + structured key
    const cleanName = file.originalname.replace(/\s+/g, "-");
    const key = `campus-ai-assistant/${Date.now()}-${cleanName}`;

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(params));

    // ✅ PUBLIC URL (FIXED)
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return fileUrl;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw error;
  }
};

module.exports = uploadToR2;
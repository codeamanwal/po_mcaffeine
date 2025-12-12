import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.S3_REGION_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function generateS3UploadUrl(fileName, fileType) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Expires: 60, // 60 sec
        ContentType: fileType,
    }
    try {
        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        return uploadUrl;
    } catch (error) {
        throw error
    }
}
import { S3Client } from '@aws-sdk/client-s3';
import { PassThrough } from 'stream';
import { stringify } from 'csv-stringify';
import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3Client({
  region: process.env.S3_REGION_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function getSignedDownloadUrl({
  bucket,
  key,
  expiresIn = 3600, // seconds (1 hour)
}) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn });
  return signedUrl;
}


export async function generateS3UploadUrl(fileName, fileType) {

    const expiresIn = 60;

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        ResponseContentType: fileType,
    });
    try {
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
        return uploadUrl;
    } catch (error) {
        throw error
    }
}

export async function uploadSkuDataToS3() {
  const passThrough = new PassThrough();

  // CSV transformer
  const csvStream = stringify({
    header: true,
    columns: [
      'id',
      'poNumber',
      'skuName',
      'qty',
      'gmv',
      'createdAt'
    ],
  });

  // Pipe CSV → S3
  csvStream.pipe(passThrough);

  const fileKey = `data/sku_orders_${Date.now()}.csv`;

  const upload = new ({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      Body: passThrough,
      ContentType: 'text/csv',
    },
  });

  // Start DB stream
  const queryStream = connection
    .query(`
      SELECT id, poNumber, skuName, qty, gmv, createdAt
      FROM sku_orders
    `)
    .stream({ highWaterMark: 1000 });

  queryStream.on('data', row => {
    csvStream.write(row);
  });

  queryStream.on('end', () => {
    csvStream.end();
  });

  queryStream.on('error', err => {
    csvStream.destroy(err);
  });

  await upload.done();

  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

import { S3Client } from '@aws-sdk/client-s3';
import { PassThrough } from 'stream';
import { stringify } from 'csv-stringify';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { sequelize } from '../db/mysql.js';
import { poFormatDataType } from './constant.js';

const s3 = new S3Client({
    region: process.env.S3_REGION_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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

/*
Upload filtered data to s3 as CSV and returns the file url
@param {string} queryString - Raw SQL query to execute
@param {Array} formatDataType - Array of objects defining fieldName and label for CSV headers
@param {Array} replacements - Replacements for the SQL query
@return {string} file url to download data
*/
export async function uploadCsvDataToS3(queryString, formatDataType, replacements = []) {
    const passThrough = new PassThrough();

    // Map fields for csv-stringify: { key: 'fieldName', header: 'Label' }
    const columns = formatDataType.map((field) => ({
        key: field.fieldName,
        header: field.label
    }));

    // CSV transformer
    const csvStream = stringify({
        header: true,
        columns: columns,
    });

    // Pipe CSV → S3
    csvStream.pipe(passThrough);

    const fileKey = `data/export_${Date.now()}.csv`;

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Body: passThrough,
            ContentType: 'text/csv',
        },
    });

    // Get raw connection for streaming
    const connection = await sequelize.connectionManager.getConnection();

    // Start DB stream
    // Note: sequelize connection.query needs raw sql.
    const queryStream = connection.query(queryString, replacements).stream({ highWaterMark: 1000 });

    queryStream.on('data', row => {
        csvStream.write(row);
    });

    queryStream.on('end', () => {
        csvStream.end();
        sequelize.connectionManager.releaseConnection(connection);
    });

    queryStream.on('error', err => {
        console.error("Stream Error:", err);
        csvStream.destroy(err);
        sequelize.connectionManager.releaseConnection(connection);
    });

    try {
        await upload.done();
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION_NAME}.amazonaws.com/${fileKey}`;
}

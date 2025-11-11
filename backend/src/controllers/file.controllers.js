import { generateS3UploadUrl } from "../utils/s3.js"

export async function getS3UploadUrl(req, res) {
    try {
        const {fileName, fileType} = req.query
        const uploadUri = await generateS3UploadUrl(fileName, fileType);
        return res.status(200).json({msg:"Fetched the s3-upload-url", uploadUrl: uploadUri});
    } catch (error) {
        return res.status(500).json({msg:"Could not generate file upload url!", error})
    }
}
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImageToCloudinary = async (image) => {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
    const uploadResponse = await new Promise((resolve, reject) =>
        cloudinary.uploader.upload_stream(
            { folder: "mern-store" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(buffer)
    );
    return uploadResponse;
};

export default uploadImageToCloudinary;
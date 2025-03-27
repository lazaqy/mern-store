import uploadImageToCloudinary from "../utils/uploadImage.js";

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;

    const uploadImage = await uploadImageToCloudinary(file);

    return res.json({
      message: "Upload done",
      data: uploadImage,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error uploading image",
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;

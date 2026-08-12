async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url: req.file.path },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "Upload failed" })
  }
}

export { uploadImage }
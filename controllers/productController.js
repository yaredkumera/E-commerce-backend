import Product from "../models/productModel.js"
async function getProducts(req, res) {
  try {
    const products = await Product.find()
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" })
  }
}

async function createProduct(req, res) {
  try {
    const existing = await Product.findOne({ name: req.body.name })
    if (existing) {
      return res.status(409).json({ success: false, message: "product already exists" })
    }

    const createdProduct = await Product.create(req.body)
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: createdProduct,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      return res.status(404).json({ success: false, message: "product not found" })
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: `something went wrong: ${err}` })
  }
}

async function deleteProduct(req, res) {
  try {
    const id = req.params.id
    const deleted = await Product.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: "product not found" })
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deleted,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

export { getProducts, createProduct, updateProduct, deleteProduct }
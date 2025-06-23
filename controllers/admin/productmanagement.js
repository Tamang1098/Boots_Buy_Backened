const Product = require("../../models/Product");
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
  const { name, price, brandId } = req.body;
  if (!name || !price || !brandId) {
    return res.status(403).json({ success: false, message: "Missing field" });
  }

  try {
    const product = new Product({
      name,
      price,
      brandId,
      filepath: req.file ? req.file.path : null,
    });
    await product.save();
    return res.status(200).json({ success: true, data: product, message: "Product saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    let filter = {};
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    const skips = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("brandId", "name")
      .skip(skips)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Product fetched",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id).populate("brandId", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product, message: "Product fetched" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      brandId: req.body.brandId,
    };
    if (req.file) updateData.filepath = req.file.path;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("brandId", "name");

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: updatedProduct, message: "Product updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

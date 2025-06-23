const express = require("express")
const router = express.Router()
const productController = require("../../controllers/admin/productmanagement")
const upload = require("../../middlewares/fileupload")
router.post(
    "/",
    upload.single("image"),
    productController.createProduct 
)
router.get(
    "/",
    productController.getProducts
)

// Get one product by ID (newly added)
router.get("/:id", productController.getProductById);

// Update product by ID (with image upload)
router.put("/:id", upload.single("image"), productController.updateProduct);

// Delete product by ID
router.delete("/:id", productController.deleteProduct);
module.exports = router
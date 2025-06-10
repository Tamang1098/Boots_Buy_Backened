const express = require("express")
const router = express.Router()
const productController = require("../../controllers/admin/productmanagement")
// can be imported as singular
// perviously
// const {createProduct} = require("../../controllers/admin/productmanagement")
// per function

router.post(
    "/",
    productController.createProduct // using dot, get function
)
router.get(
    "/",
    productController.getProducts
)
module.exports = router
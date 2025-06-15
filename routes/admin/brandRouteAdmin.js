const express = require('express');
const router = express.Router();
// const {createCategory} = require('../../controllers/admin/categorymanagement');
const brandController = require('../../controllers/admin/brandController');
// can be implemented using single import
const upload = require("../../middlewares/fileupload")

// implement using dot function
router.post(
    '/', 
    upload.single("image"),
    // req.file, req.files from next function
    // get image, file metadata
    brandController.createBrand
);
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.put('/:id', brandController.updateBrand);
router.delete('/:id',brandController.deleteBrand);

module.exports = router;
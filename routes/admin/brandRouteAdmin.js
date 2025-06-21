// const express = require('express');
// const router = express.Router();

// const brandController = require('../../controllers/admin/brandController');

// const upload = require("../../middlewares/fileupload")


// router.post(
//     '/', 
//     upload.single("image"),
    
//     brandController.createBrand
// );
// router.get('/', brandController.getAllBrands);
// router.get('/:id', brandController.getBrandById);
// router.put('/:id', brandController.updateBrand);
// router.delete('/:id',brandController.deleteBrand);

// module.exports = router;



const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/admin/brandController');
const upload = require('../../middlewares/fileupload');

// Create brand (with image upload)
router.post('/', upload.single('image'), brandController.createBrand);

// Get all brands
router.get('/', brandController.getAllBrands);

// Get brand by id
router.get('/:id', brandController.getBrandById);

// Update brand (with optional image upload)
router.put('/:id', upload.single('image'), brandController.updateBrand);

// Delete brand
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
